#!/usr/bin/env python3
from __future__ import annotations

import math
import re
import zipfile
from collections import defaultdict
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape as xml_escape


ROOT = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT / "public" / "docs" / "projects"
MARKDOWN_OUT = ROOT / "public" / "docs" / "ada-project-history.md"
XLSX_OUT = ROOT / "public" / "docs" / "ada-project-budgets.xlsx"

FINANCE_REVIEW_NOTES = {
    "idp-girls-baking-training-jul-2022": "The previous July baking project documents and financial schedule have been withdrawn. A revised record is under review; no numeric budget or actual expenditure is published here.",
    "school-visit-mentorship-may-2022": "The previous May project account and financial schedule have been withdrawn. A revised community-cleanup record is under review; no numeric budget or actual expenditure is published here.",
    "back-to-school-sep-2022": "The previous financial schedule has been withdrawn. A revised record is under review; no numeric budget or actual expenditure is published here.",
    "first-widow-home-visits-2021": (
        "Owner recollection only: 120,000 CFA sent; about 110,000 CFA spent including about 10,000 CFA withdrawal costs. Approximate 10,000 CFA difference is not a verified balance."
    ),
    "school-supply-distribution-feb-2022": (
        "Owner recalls 215,000 CFA sent, about 5,000 CFA withdrawal costs, and about 10,000–15,000 CFA transportation, leaving an estimated 195,000–200,000 CFA for supplies. These are not independently reconciled. The category amounts shown in the project documents are illustrative only, not historical expenditure."
    ),
    "widow-support-food-cash-mar-2022": (
        "Owner recalls about 220,000 CFA sent, about 5,000 CFA withdrawal costs, and about 10,000 CFA transportation, leaving an estimated 205,000 CFA for the listed supplies. These approximate figures have not been independently reconciled; no item quantities, category costs, cash assistance, or balance are verified."
    ),
}
PROJECT_IDENTITY_OVERRIDES = {
    "first-widow-home-visits-2021": ("First Widow Home Visits", "ADA/2021/001"),
    "school-supply-distribution-feb-2022": ("School Supply Distribution", "ADA/2022/001"),
    "widow-support-food-cash-mar-2022": ("Women's Day Widow Outreach", "ADA/2022/003"),
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clean_cell(value: str) -> str:
    return normalize_whitespace(value.replace("\u00a0", " "))


def first_nonempty(values: Iterable[str]) -> str:
    for value in values:
        if value and value.strip():
            return value.strip()
    return ""


def extract_first(patterns: list[str], text: str, flags: int = re.I | re.M) -> str:
    for pattern in patterns:
        match = re.search(pattern, text, flags)
        if match:
            value = next((g for g in match.groups() if g), "")
            if value:
                return clean_cell(value)
    return ""


def extract_field(text: str, names: list[str]) -> str:
    name_pattern = "|".join(re.escape(name) for name in names)
    patterns = [
        rf"^\|\s*\*\*(?:{name_pattern})\*\*\s*\|\s*([^|\n]+)",
        rf"^\|\s*(?:{name_pattern})\s*\|\s*([^|\n]+)",
        rf"^\*\*(?:{name_pattern})\*\*[:：]\s*([^\n]+)",
        rf"^(?:{name_pattern})[:：]\s*([^\n]+)",
    ]
    return extract_first(patterns, text)


def extract_heading_block(text: str, heading_terms: list[str]) -> str:
    lines = text.splitlines()
    heading_indexes: list[int] = []
    term_pattern = re.compile("|".join(re.escape(term) for term in heading_terms), re.I)
    for index, line in enumerate(lines):
        if re.match(r"^#{1,6}\s+", line) and term_pattern.search(line):
            heading_indexes.append(index)
    if not heading_indexes:
        return ""
    start = heading_indexes[0] + 1
    end = len(lines)
    for index in range(start, len(lines)):
        if re.match(r"^#{1,6}\s+", lines[index]):
            end = index
            break
    return "\n".join(lines[start:end]).strip()


def extract_paragraphs(text: str) -> list[str]:
    paragraphs = []
    current: list[str] = []
    for line in text.splitlines():
        if not line.strip():
            if current:
                paragraphs.append(clean_cell(" ".join(current)))
                current = []
            continue
        if line.startswith("|"):
            continue
        if re.match(r"^#{1,6}\s+", line):
            continue
        if line.strip().startswith("*") and line.strip().endswith("*") and len(line.strip()) < 120:
            continue
        current.append(line.strip())
    if current:
        paragraphs.append(clean_cell(" ".join(current)))
    return [p for p in paragraphs if p]


def is_separator_row(row: list[str]) -> bool:
    if not row:
        return True
    return all(not re.search(r"[A-Za-z0-9]", cell or "") or re.fullmatch(r"[:\-\s]+", cell or "") for cell in row)


def extract_bullet_lines(section: str, limit: int = 3) -> list[str]:
    bullets: list[str] = []
    for line in section.splitlines():
        stripped = line.strip()
        if re.match(r"^[-*]\s+", stripped):
            bullets.append(clean_cell(re.sub(r"^[-*]\s+", "", stripped)))
        if len(bullets) >= limit:
            break
    return bullets


def extract_sentence_snippet(text: str, limit: int = 2) -> str:
    paragraphs = extract_paragraphs(text)
    if not paragraphs:
        return ""
    first = " ".join(paragraphs[:2])
    sentences = re.split(r"(?<=[.!?])\s+", first)
    sentences = [s.strip() for s in sentences if s.strip()]
    snippet = " ".join(sentences[:limit]).strip()
    return snippet


def parse_markdown_tables(text: str) -> list[dict[str, object]]:
    tables: list[dict[str, object]] = []
    lines = text.splitlines()
    current_heading = ""
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if re.match(r"^#{1,6}\s+", line):
            current_heading = re.sub(r"^#{1,6}\s+", "", line).strip()
            i += 1
            continue
        if not lines[i].lstrip().startswith("|"):
            i += 1
            continue
        block = []
        while i < len(lines) and lines[i].lstrip().startswith("|"):
            block.append(lines[i].strip())
            i += 1
        if len(block) < 2:
            continue
        rows = []
        for row in block:
            cells = [clean_cell(cell) for cell in row.strip("|").split("|")]
            rows.append(cells)
        header = rows[0]
        data = rows[1:]
        if data and is_separator_row(data[0]):
            data = data[1:]
        data = [row for row in data if not is_separator_row(row)]
        tables.append({"header": header, "rows": data, "raw": block, "section": current_heading})
        continue
    return tables


def parse_int(value: str) -> int | None:
    text = (value or "").replace("−", "-").replace("–", "-")
    match = re.search(r"[-+]?\d[\d,]*(?:\.\d+)?", text)
    if not match:
        return None
    try:
        return int(float(match.group(0).replace(",", "")))
    except ValueError:
        return None


def parse_float(value: str) -> float | None:
    text = (value or "").replace("−", "-").replace("–", "-")
    match = re.search(r"[-+]?\d[\d,]*(?:\.\d+)?", text)
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


def find_value_by_label(tables: list[dict[str, object]], labels: list[str]) -> str:
    label_patterns = [re.compile(rf"\b{re.escape(label)}\b", re.I) for label in labels]
    for table in tables:
        rows = table["rows"]  # type: ignore[assignment]
        for row in rows:
            if not row:
                continue
            first = row[0]
            if any(pattern.search(first) for pattern in label_patterns):
                values = [cell for cell in row[1:] if cell and not re.match(r"^[\-=]+$", cell)]
                value = first_nonempty(values)
                if value:
                    return value
    return ""


def find_table_rows(tables: list[dict[str, object]]) -> list[dict[str, object]]:
    rows_out: list[dict[str, object]] = []
    for table in tables:
        header = [cell.lower() for cell in table["header"]]  # type: ignore[index]
        rows = table["rows"]  # type: ignore[assignment]
        if not rows:
            continue
        if not any(
            term in " ".join(header)
            for term in ["budget", "actual", "spent", "variance", "line item", "category", "item"]
        ):
            continue
        for row in rows:
            if not row:
                continue
            if len(row) < 2:
                continue
            label = row[0]
            if not label or label.upper() in {"TOTAL", "**TOTAL**"}:
                continue
            numeric_values = [parse_int(cell) for cell in row[1:] if parse_int(cell) is not None]
            if not numeric_values:
                continue
            rows_out.append({"header": table["header"], "row": row})
    return rows_out


def is_metadata_table(header: list[str]) -> bool:
    cleaned = [cell.lower() for cell in header]
    if len(cleaned) >= 2 and cleaned[0] == "field" and cleaned[1] in {"detail", "details"}:
        return True
    return False


def numeric_value(cell: str) -> int | None:
    if cell is None:
        return None
    text = clean_cell(str(cell))
    if not text or re.fullmatch(r"[-—–]+", text):
        return None
    return parse_int(text)


def pick_header_index(headers: list[str], *needles: str) -> int | None:
    lowered = [clean_cell(header).lower() for header in headers]
    for index, header in enumerate(lowered):
        if any(needle in header for needle in needles):
            return index
    return None


def first_descriptive_cell(row: list[str], headers: list[str]) -> str:
    skip_indexes = {index for index, header in enumerate(headers) if clean_cell(header).lower() in {"#", "no", "number", "id"}}
    for index, cell in enumerate(row):
        if index in skip_indexes:
            continue
        text = clean_cell(cell)
        if not text:
            continue
        if re.fullmatch(r"[-—–]+", text):
            continue
        if parse_int(text) is not None and not re.search(r"[A-Za-z]", text):
            continue
        return text
    return ""


def normalized_label(value: str) -> str:
    return re.sub(r"[\*\*_`]+", "", clean_cell(value)).strip().upper()


def extract_expense_rows(tables: list[dict[str, object]], project_title: str, year: int, reference: str, source: str) -> list[dict[str, object]]:
    rows_out: list[dict[str, object]] = []
    for table in tables:
        header = [clean_cell(cell) for cell in table["header"]]  # type: ignore[index]
        if is_metadata_table(header):
            continue
        rows = table["rows"]  # type: ignore[assignment]
        if not rows:
            continue
        section = clean_cell(str(table.get("section", "")))
        header_text = " | ".join(header)
        context = f"{section} {header_text}".lower()
        if any(needle in context for needle in ["funding source", "cost per beneficiary", "cost-effectiveness", "certification", "financial controls"]):
            continue
        if not any(needle in context for needle in ["budget", "expenditure", "expense", "disbursement", "allocation", "variance", "monthly", "detailed", "cost"]):
            continue
        for row in rows:
            if not row:
                continue
            first_value = first_descriptive_cell(row, header)
            if not first_value:
                continue
            upper_label = normalized_label(first_value)
            if upper_label in {"TOTAL", "SUBTOTAL", "GRAND TOTAL", "SUMMARY", "USD EQUIVALENT", "TOTAL FUNDING", "TOTAL FUNDING USED"}:
                continue
            if "TOTAL" in upper_label and "ITEM" not in upper_label and "TOTAL" != upper_label:
                continue

            item_index = pick_header_index(header, "line item", "budget line", "item", "category", "activity", "description")
            qty_index = pick_header_index(header, "qty", "quantity", "count")
            unit_cost_index = pick_header_index(header, "unit cost", "unit price", "unit")
            budget_index = pick_header_index(header, "budgeted", "approved budget", "budget", "approved", "planned", "allocated")
            actual_index = pick_header_index(header, "actual", "spent", "expenditure", "used", "disbursed", "spent to date")
            variance_index = pick_header_index(header, "variance", "savings", "remaining", "difference")
            percent_index = pick_header_index(header, "%", "percent", "utilization", "spent")
            notes_index = pick_header_index(header, "note", "notes", "comment", "remarks")
            amount_index = pick_header_index(header, "amount")

            item = ""
            if item_index is not None and item_index < len(row):
                item = clean_cell(row[item_index])
            if not item:
                item = first_value
            if item in {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10"} and len(row) > 1:
                candidate = first_descriptive_cell(row[1:], header[1:]) if len(row) > 1 else ""
                if candidate:
                    item = candidate

            quantity = numeric_value(row[qty_index]) if qty_index is not None and qty_index < len(row) else None
            unit_cost = numeric_value(row[unit_cost_index]) if unit_cost_index is not None and unit_cost_index < len(row) else None
            budget_cfa = numeric_value(row[budget_index]) if budget_index is not None and budget_index < len(row) else None
            actual_cfa = numeric_value(row[actual_index]) if actual_index is not None and actual_index < len(row) else None
            variance_cfa = numeric_value(row[variance_index]) if variance_index is not None and variance_index < len(row) else None
            amount_cfa = numeric_value(row[amount_index]) if amount_index is not None and amount_index < len(row) else None
            percent_value = clean_cell(row[percent_index]) if percent_index is not None and percent_index < len(row) else ""
            notes = clean_cell(row[notes_index]) if notes_index is not None and notes_index < len(row) else ""

            numeric_cells = [numeric_value(cell) for cell in row if numeric_value(cell) is not None]
            if not any([budget_cfa, actual_cfa, variance_cfa, amount_cfa, numeric_cells]):
                continue

            if amount_cfa is None:
                amount_headers = {"amount", "cost", "expenditure"}
                if any(any(term in clean_cell(h).lower() for term in amount_headers) for h in header):
                    if actual_cfa is None and budget_cfa is None:
                        amount_candidates = [n for n in numeric_cells if n is not None]
                        amount_cfa = amount_candidates[-1] if amount_candidates else None

            if budget_cfa is None and actual_cfa is None and amount_cfa is not None:
                actual_cfa = amount_cfa

            if variance_cfa is None and budget_cfa is not None and actual_cfa is not None:
                variance_cfa = budget_cfa - actual_cfa

            detail_type = "detail"
            header_lower = " ".join(h.lower() for h in header)
            if "summary" in section.lower() or "summary" in header_lower:
                if not any(term in header_lower for term in ["budget", "actual", "expenditure", "expense", "variance", "amount", "month"]):
                    detail_type = "summary"
            if "category" in header_lower and "item" not in header_lower:
                detail_type = "category"
            if "month" in section.lower():
                detail_type = "monthly"

            rows_out.append(
                {
                    "project": project_title,
                    "year": year,
                    "reference": reference,
                    "section": section,
                    "table_header": header_text,
                    "detail_type": detail_type,
                    "item": item,
                    "quantity": quantity,
                    "unit_cost_cfa": unit_cost,
                    "amount_cfa": amount_cfa,
                    "budget_cfa": budget_cfa,
                    "actual_cfa": actual_cfa,
                    "variance_cfa": variance_cfa,
                    "percent": percent_value,
                    "notes": notes,
                    "source": source,
                    "raw_row": " | ".join(row),
                }
            )
    has_itemized_rows = any(
        row["detail_type"] in {"detail", "monthly"} or row["quantity"] is not None or row["unit_cost_cfa"] is not None
        for row in rows_out
    )
    if has_itemized_rows:
        rows_out = [row for row in rows_out if row["detail_type"] in {"detail", "monthly"} or row["quantity"] is not None or row["unit_cost_cfa"] is not None]
    return rows_out


@dataclass
class ProjectRecord:
    slug: str
    title: str
    reference: str
    year: int
    period: str
    location: str
    beneficiaries: str
    status: str
    approved_budget_cfa: int | None
    actual_cfa: int | None
    variance_cfa: int | None
    utilization_pct: float | None
    what_we_did: str
    outcomes: str
    finance_note: str
    report_path: str
    financial_path: str
    line_items: list[dict[str, object]]


def parse_project(slug_dir: Path) -> ProjectRecord | None:
    report_path = slug_dir / "report.md"
    financial_path = slug_dir / "financial.md"
    if not report_path.exists() or not financial_path.exists():
        return None

    report_text = read_text(report_path)
    financial_text = read_text(financial_path)
    financial_tables = parse_markdown_tables(financial_text)

    title = first_nonempty(
        [
            extract_field(report_text, ["Project Title"]),
            extract_field(report_text, ["Project"]),
            extract_first([r"^#\s+(.+)$"], report_text),
            slug_dir.name.replace("-", " ").title(),
        ]
    )

    reference = first_nonempty(
        [
            extract_field(report_text, ["Reference", "Reference Number", "Project Reference"]),
            extract_field(financial_text, ["Reference", "Project Reference"]),
        ]
    )
    if slug_dir.name in PROJECT_IDENTITY_OVERRIDES:
        title, reference = PROJECT_IDENTITY_OVERRIDES[slug_dir.name]

    year_match = re.search(r"ADA/(\d{4})/", report_text)
    year = int(year_match.group(1)) if year_match else int(slug_dir.name.rsplit("-", 1)[-1]) if re.search(r"-\d{4}$", slug_dir.name) else 0
    if not year:
        year_from_reference = re.search(r"ADA/(\d{4})/", financial_text)
        year = int(year_from_reference.group(1)) if year_from_reference else 0

    period = first_nonempty(
        [
            extract_field(report_text, ["Reporting Period", "Implementation Period", "Period", "Date of Activity", "Date"]),
            extract_field(financial_text, ["Reporting Period", "Implementation Period", "Period", "Date of Activity", "Date"]),
        ]
    )

    location = first_nonempty(
        [
            extract_field(report_text, ["Location", "Project Location"]),
            extract_field(financial_text, ["Location", "Project Location"]),
        ]
    )

    beneficiaries = first_nonempty(
        [
            extract_field(report_text, ["Direct Beneficiaries", "Total Beneficiaries", "Beneficiaries", "Participants"]),
            extract_field(financial_text, ["Direct Beneficiaries", "Total Beneficiaries", "Beneficiaries", "Participants"]),
        ]
    )

    status = first_nonempty(
        [
            extract_field(report_text, ["Status"]),
            extract_field(financial_text, ["Status", "Report Type"]),
        ]
    )
    status = status.replace("Report Type", "").strip(" :-") if status else ""
    if not status:
        status = "completed"

    approved_raw = first_nonempty(
        [
            find_value_by_label(financial_tables, ["Approved Budget", "Total Budget", "Budgeted"]),
            extract_field(financial_text, ["Approved Budget", "Total Budget", "Budgeted"]),
        ]
    )
    actual_raw = first_nonempty(
        [
            find_value_by_label(financial_tables, ["Actual Expenditure", "Actual Expense", "Actual Spend", "Spent to Date", "Actual"]),
            extract_field(financial_text, ["Actual Expenditure", "Actual Expense", "Actual Spend", "Spent to Date", "Actual"]),
        ]
    )
    variance_raw = first_nonempty(
        [
            find_value_by_label(financial_tables, ["Variance", "Remaining", "Savings"]),
            extract_field(financial_text, ["Variance", "Remaining", "Savings"]),
        ]
    )
    utilization_raw = first_nonempty(
        [
            find_value_by_label(financial_tables, ["Budget Utilization", "Budget utilization", "Utilization", "Burn Rate"]),
            extract_field(financial_text, ["Budget Utilization", "Budget utilization", "Utilization", "Burn Rate"]),
        ]
    )

    approved_budget_cfa = parse_int(approved_raw)
    actual_cfa = parse_int(actual_raw)
    variance_cfa = parse_int(variance_raw)
    if approved_budget_cfa is not None and actual_cfa is not None and variance_cfa is None:
        variance_cfa = approved_budget_cfa - actual_cfa

    utilization_pct = parse_float(utilization_raw)
    if utilization_pct is None and approved_budget_cfa and actual_cfa is not None:
        utilization_pct = round((actual_cfa / approved_budget_cfa) * 100, 1)

    finance_review_note = FINANCE_REVIEW_NOTES.get(slug_dir.name)
    if finance_review_note:
        # Do not let withdrawn figures in old source text feed generated totals or line items.
        approved_budget_cfa = None
        actual_cfa = None
        variance_cfa = None
        utilization_pct = None

    summary_block = extract_heading_block(
        report_text,
        [
            "Executive Summary",
            "Executive summary",
            "Summary",
        ],
    )
    activities_block = extract_heading_block(
        report_text,
        [
            "Activities",
            "Activities Conducted",
            "Activities Delivered",
            "Activities Implemented",
            "Implementation Timeline",
        ],
    )
    outcomes_block = extract_heading_block(
        report_text,
        [
            "Outcomes",
            "Outcomes and Results",
            "Outcomes & Impact",
            "Outcomes Achieved",
            "Results",
            "Key Results",
            "Beneficiary Outcomes",
        ],
    )
    variance_block = extract_heading_block(
        financial_text,
        [
            "Variance Analysis",
            "Variance Explanation",
        ],
    )

    what_parts = []
    summary_snippet = extract_sentence_snippet(summary_block or report_text, limit=2)
    if summary_snippet:
        what_parts.append(summary_snippet)
    activity_bullets = extract_bullet_lines(activities_block, limit=2)
    if activity_bullets:
        what_parts.extend(activity_bullets)
    what_we_did = " ".join(what_parts).strip()

    outcome_parts = []
    outcome_bullets = extract_bullet_lines(outcomes_block, limit=3)
    if outcome_bullets:
        outcome_parts.extend(outcome_bullets)
    elif summary_snippet:
        outcome_parts.append(summary_snippet)
    outcomes = " ".join(outcome_parts).strip()
    if finance_review_note:
        outcomes = "Not established in this review."

    finance_note_parts = extract_bullet_lines(variance_block, limit=2)
    if finance_review_note:
        finance_note_parts = [finance_review_note]
    elif not finance_note_parts and variance_cfa is not None:
        sign = "under" if variance_cfa >= 0 else "over"
        finance_note_parts = [f"{abs(variance_cfa):,} CFA {sign} budget."]
    finance_note = " ".join(finance_note_parts).strip()

    line_items = [] if finance_review_note else extract_expense_rows(
        financial_tables,
        project_title=title,
        year=year,
        reference=reference,
        source=financial_path.name,
    )

    return ProjectRecord(
        slug=slug_dir.name,
        title=title,
        reference=reference,
        year=year,
        period=period,
        location=location,
        beneficiaries=beneficiaries,
        status=status,
        approved_budget_cfa=approved_budget_cfa,
        actual_cfa=actual_cfa,
        variance_cfa=variance_cfa,
        utilization_pct=utilization_pct,
        what_we_did=what_we_did,
        outcomes=outcomes,
        finance_note=finance_note,
        report_path=str(report_path.relative_to(ROOT)),
        financial_path=str(financial_path.relative_to(ROOT)),
        line_items=line_items,
    )


def currency(value: int | None) -> str:
    if value is None:
        return "—"
    return f"{value:,} CFA"


def percent(value: float | None) -> str:
    if value is None:
        return "—"
    if float(value).is_integer():
        return f"{int(value)}%"
    return f"{value:.1f}%"


def sentence_case(value: str) -> str:
    return value[:1].upper() + value[1:] if value else value


def build_markdown(projects: list[ProjectRecord]) -> str:
    projects_by_year: dict[int, list[ProjectRecord]] = defaultdict(list)
    for project in projects:
        projects_by_year[project.year].append(project)

    years = sorted(projects_by_year, reverse=True)
    total_approved = sum(p.approved_budget_cfa or 0 for p in projects)
    total_actual = sum(p.actual_cfa or 0 for p in projects)

    lines: list[str] = []
    lines.append("# ADA Project History and Budget Ledger")
    lines.append("")
    lines.append(
        "This ledger focuses on the archived projects and their budget records from 2021 through 2025. "
        "It pairs the narrative completion reports with the financial reports so the story of each project stays tied to the numbers."
    )
    lines.append("")
    today = date.today()
    compiled_on = f"{today.strftime('%B')} {today.day}, {today.year}"
    lines.append(f"Compiled on {compiled_on} from the project archive under `public/docs/projects/`.")
    lines.append("")
    lines.append(
        f"Archived projects included: {len(projects)}. Sum of reported approved amounts: {currency(total_approved)}. "
        f"Sum of reported actual/spent amounts: {currency(total_actual)}. These sums may cover different project sets and are not comparable as a portfolio variance."
    )
    if FINANCE_REVIEW_NOTES:
        lines.append("")
        lines.append(
            f"Figures for {len(FINANCE_REVIEW_NOTES)} projects are under reconciliation and are excluded from numeric summaries and line-item totals. Other figures below are transcribed from source documents and have not been independently verified."
        )
    lines.append("")
    lines.append(
        "Active projects are intentionally excluded here so the focus stays on completed and archived work."
    )
    lines.append("")
    lines.append("## Portfolio Snapshot")
    lines.append("")
    lines.append("| Year | Projects | Records with figures | Sum of reported approved amounts | Sum of reported actual/spent amounts |")
    lines.append("|---|---:|---:|---:|---:|")
    for year in years:
        year_projects = projects_by_year[year]
        approved_records = [p.approved_budget_cfa for p in year_projects if p.approved_budget_cfa is not None]
        actual_records = [p.actual_cfa for p in year_projects if p.actual_cfa is not None]
        approved = sum(approved_records) if approved_records else None
        actual = sum(actual_records) if actual_records else None
        records_with_figures = sum(1 for p in year_projects if p.approved_budget_cfa is not None or p.actual_cfa is not None)
        lines.append(
            f"| {year} | {len(year_projects)} | {records_with_figures} | {currency(approved)} | {currency(actual)} |"
        )
    lines.append("")
    lines.append("## Project Ledger")
    lines.append("")
    for year in years:
        lines.append(f"### {year}")
        lines.append("")
        for project in sorted(projects_by_year[year], key=lambda p: p.title):
            lines.append(f"#### {project.title}")
            lines.append("")
            lines.append(
                f"- Reference: `{project.reference or 'N/A'}` | Location: {project.location or 'N/A'} | Period: {project.period or 'N/A'} | Status: {project.status or 'completed'}"
            )
            if project.beneficiaries:
                lines.append(f"- Beneficiaries: {project.beneficiaries}")
            if project.what_we_did:
                lines.append(f"- What we did: {project.what_we_did}")
            if project.outcomes:
                lines.append(f"- Outcomes: {project.outcomes}")
            if project.slug in FINANCE_REVIEW_NOTES:
                lines.append("- Financial status: Under reconciliation; no figures from the previous itemized table are included in numeric summaries.")
            else:
                budget_summary = (
                    f"Reported approved {currency(project.approved_budget_cfa)}; "
                    f"reported actual/spent {currency(project.actual_cfa)}; "
                    f"difference {currency(project.variance_cfa)}; "
                    f"utilization {percent(project.utilization_pct)}."
                )
                lines.append(f"- Financial summary: {budget_summary}")
            if project.finance_note:
                lines.append(f"- Finance note: {project.finance_note}")
            lines.append(
                f"- Source files: [`{Path(project.report_path).name}`]({project.report_path}), [`{Path(project.financial_path).name}`]({project.financial_path})"
            )
            lines.append("")
        lines.append("")
    lines.append("## Budget Workbook")
    lines.append("")
    lines.append(
        "The companion workbook `ada-project-budgets.xlsx` contains a project summary sheet and a detailed expense sheet with item-level rows, quantities, amounts, notes, and source references."
    )
    lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def column_letter(index: int) -> str:
    letters = ""
    while index:
        index, rem = divmod(index - 1, 26)
        letters = chr(65 + rem) + letters
    return letters


def cell_xml(value: object, row: int, col: int) -> str:
    ref = f"{column_letter(col)}{row}"
    if value is None:
        return ""
    if isinstance(value, bool):
        return f'<c r="{ref}" t="b"><v>{1 if value else 0}</v></c>'
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if isinstance(value, float) and value.is_integer():
            value = int(value)
        return f'<c r="{ref}"><v>{value}</v></c>'
    text = xml_escape(str(value))
    return f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{text}</t></is></c>'


def sheet_xml(rows: list[list[object]]) -> str:
    xml_rows = []
    for row_index, row in enumerate(rows, start=1):
        cells = [cell_xml(value, row_index, col_index) for col_index, value in enumerate(row, start=1)]
        xml_rows.append(f'<row r="{row_index}">{"".join(cells)}</row>')
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f'<sheetData>{"".join(xml_rows)}</sheetData>'
        '</worksheet>'
    )


def write_xlsx(path: Path, sheets: list[tuple[str, list[list[object]]]]) -> None:
    content_types = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                     '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">']
    content_types.append('<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>')
    content_types.append('<Default Extension="xml" ContentType="application/xml"/>')
    content_types.append('<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>')
    for index, _ in enumerate(sheets, start=1):
        content_types.append(f'<Override PartName="/xl/worksheets/sheet{index}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
    content_types.append('</Types>')

    rels_root = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        '</Relationships>'
    )

    workbook_sheets = []
    workbook_rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                     '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">']
    for index, (name, _) in enumerate(sheets, start=1):
        workbook_sheets.append(
            f'<sheet name="{xml_escape(name)}" sheetId="{index}" r:id="rId{index}"/>'
        )
        workbook_rels.append(
            f'<Relationship Id="rId{index}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{index}.xml"/>'
        )
    workbook_rels.append('</Relationships>')
    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<sheets>{"".join(workbook_sheets)}</sheets>'
        '</workbook>'
    )

    docprops_core = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        '<dc:creator>Codex</dc:creator>'
        '<cp:lastModifiedBy>Codex</cp:lastModifiedBy>'
        '<dcterms:created xsi:type="dcterms:W3CDTF">2026-06-10T00:00:00Z</dcterms:created>'
        '<dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-10T00:00:00Z</dcterms:modified>'
        '</cp:coreProperties>'
    )
    docprops_app = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        '<Application>Codex</Application>'
        '</Properties>'
    )

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", "".join(content_types))
        zf.writestr("_rels/.rels", rels_root)
        zf.writestr("docProps/core.xml", docprops_core)
        zf.writestr("docProps/app.xml", docprops_app)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", "".join(workbook_rels))
        for index, (_, rows) in enumerate(sheets, start=1):
            zf.writestr(f"xl/worksheets/sheet{index}.xml", sheet_xml(rows))


def build_workbook_rows(projects: list[ProjectRecord]) -> tuple[list[list[object]], list[list[object]]]:
    summary_rows: list[list[object]] = [[
        "Year",
        "Project",
        "Reference",
        "Status",
        "Period",
        "Location",
        "Beneficiaries",
        "Approved CFA",
        "Actual/Spent CFA",
        "Variance CFA",
        "Utilization %",
        "What we did",
        "Outcomes",
        "Report file",
        "Financial file",
        "Finance review note",
    ]]
    detail_rows: list[list[object]] = [[
        "Year",
        "Project",
        "Reference",
        "Section",
        "Table Header",
        "Detail Type",
        "Item",
        "Quantity",
        "Unit Cost CFA",
        "Amount CFA",
        "Budget CFA",
        "Actual CFA",
        "Variance CFA",
        "Percent / Utilization",
        "Notes",
        "Source",
        "Raw Row",
    ]]

    for project in sorted(projects, key=lambda p: (p.year, p.title)):
        summary_rows.append([
            project.year,
            project.title,
            project.reference,
            project.status,
            project.period,
            project.location,
            project.beneficiaries,
            project.approved_budget_cfa or "",
            project.actual_cfa or "",
            project.variance_cfa or "",
            project.utilization_pct or "",
            project.what_we_did,
            project.outcomes,
            project.report_path,
            project.financial_path,
            project.finance_note,
        ])
        for item in project.line_items:
            detail_rows.append([
                item["year"],
                item["project"],
                item["reference"],
                item.get("section", ""),
                item.get("table_header", ""),
                item.get("detail_type", ""),
                item.get("item", ""),
                item.get("quantity", ""),
                item.get("unit_cost_cfa", ""),
                item.get("amount_cfa", ""),
                item["budget_cfa"],
                item["actual_cfa"],
                item["variance_cfa"],
                item.get("percent", ""),
                item["notes"],
                item["source"],
                item.get("raw_row", ""),
            ])
    return summary_rows, detail_rows


def main() -> None:
    projects: list[ProjectRecord] = []
    for slug_dir in sorted(p for p in PROJECTS_DIR.iterdir() if p.is_dir()):
        project = parse_project(slug_dir)
        if project:
            projects.append(project)

    projects.sort(key=lambda p: (p.year, p.title))

    MARKDOWN_OUT.write_text(build_markdown(projects), encoding="utf-8")

    summary_rows, line_item_rows = build_workbook_rows(projects)
    write_xlsx(XLSX_OUT, [("Summary", summary_rows), ("Detailed Expenses", line_item_rows)])

    print(f"Wrote {MARKDOWN_OUT.relative_to(ROOT)}")
    print(f"Wrote {XLSX_OUT.relative_to(ROOT)}")
    print(f"Projects processed: {len(projects)}")


if __name__ == "__main__":
    main()
