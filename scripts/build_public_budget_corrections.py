#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import zipfile
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape as xml_escape

from build_project_ledger import PROJECTS_DIR, parse_project


ROOT = Path(__file__).resolve().parents[1]
OUT_MD = ROOT / "public" / "docs" / "ada-public-budget-adjustments.md"
OUT_XLSX = ROOT / "public" / "docs" / "ada-public-budget-adjustments.xlsx"
OUT_CSV = ROOT / "public" / "docs" / "ada-public-budget-adjustments.csv"
OUT_JSON = ROOT / "public" / "docs" / "ada-public-budget-adjustments.json"
CAP_CFA = 400_000
FINANCE_REVIEW_PROJECTS = {
    "idp-girls-baking-training-jul-2022": "The previous July baking project documents and financial schedule have been withdrawn. A revised record is under review; no numeric budget or actual expenditure is published here.",
    "back-to-school-sep-2022": "The previous financial schedule has been withdrawn. A revised record is under review; no numeric budget or actual expenditure is published here.",
    "first-widow-home-visits-2021": "Owner recalls about 110,000 CFA spent, including withdrawal costs; no reconciled budget or actual is available. The approximate difference is not a verified balance.",
    "school-supply-distribution-feb-2022": "Owner recalls 215,000 CFA sent, about 5,000 CFA withdrawal costs, and about 10,000–15,000 CFA transportation, leaving an estimated 195,000–200,000 CFA for supplies. These figures are not independently reconciled; the category allocation is illustrative only, not actual expenditure.",
    "widow-support-food-cash-mar-2022": "Owner recalls about 220,000 CFA sent, about 5,000 CFA withdrawal costs, and about 10,000 CFA transportation, leaving an estimated 205,000 CFA for the listed supplies. These approximate figures have not been independently reconciled; item quantities, category costs, cash assistance, and any balance are not established.",
}


def currency(value: int | None) -> str:
    if value is None:
        return "—"
    return f"{value:,} CFA"


def simple_title(value: str) -> str:
    return value.replace("Project Report: ", "").replace("Project Completion Report: ", "").strip()


@dataclass
class BudgetRow:
    year: int
    project: str
    reference: str
    archive_approved: int | None
    archive_actual: int | None
    public_target: int | None
    adjustment_needed: int | None
    status: str
    note: str


def build_rows() -> list[BudgetRow]:
    rows: list[BudgetRow] = []
    from reconcile_2023_records import records as reviewed_2023_records
    reviewed_2023_slugs = {p["slug"] for p in reviewed_2023_records()}
    for slug_dir in sorted(p for p in PROJECTS_DIR.iterdir() if p.is_dir()):
        if slug_dir.name in {"school-visit-mentorship-may-2022", "young-women-skills-training-program"}:
            continue  # Withdrawn records are excluded even if an old source directory reappears.
        if slug_dir.name in reviewed_2023_slugs:
            continue  # The qualified adapter replaces stale source claims before aggregation.
        project = parse_project(slug_dir)
        if not project:
          continue
        if slug_dir.name in FINANCE_REVIEW_PROJECTS:
            rows.append(
                BudgetRow(
                    year=project.year,
                    project=simple_title(project.title),
                    reference=project.reference or "",
                    archive_approved=None,
                    archive_actual=None,
                    public_target=None,
                    adjustment_needed=None,
                    status="under review",
                    note=FINANCE_REVIEW_PROJECTS[slug_dir.name],
                )
            )
            continue
        archive_value = project.actual_cfa if project.actual_cfa is not None else project.approved_budget_cfa
        if archive_value is None:
            continue
        public_target = min(archive_value, CAP_CFA)
        adjustment = archive_value - public_target
        status = "ok" if archive_value <= CAP_CFA else "adjusted"
        note = "Within public cap" if status == "ok" else f"Capped from {currency(archive_value)} to {currency(public_target)}"
        rows.append(
            BudgetRow(
                year=project.year,
                project=simple_title(project.title),
                reference=project.reference or "",
                archive_approved=project.approved_budget_cfa,
                archive_actual=project.actual_cfa,
                public_target=public_target,
                adjustment_needed=adjustment if adjustment > 0 else 0,
                status=status,
                note=note,
            )
        )
    from reconcile_2022_finance import reconcile_budget
    from reconcile_2023_records import reconcile_budget as reconcile_2023_budget
    return reconcile_2023_budget(reconcile_budget(rows))


def write_markdown(rows: list[BudgetRow]) -> str:
    lines = [
        "# ADA Public Budget Adjustments",
        "",
        "This sheet presents per-project public adjustment rows based on figures extracted from the archived project documents. It is not an independently verified financial statement.",
        "",
        f"Compiled on {date.today().strftime('%B')} {date.today().day}, {date.today().year}.",
        "",
        "Aggregate financial totals are omitted because the source rows do not consistently report the same basis: some contain approved budgets, some reported actuals, and some both. These amounts should be checked against supporting records before being treated as final.",
        "",
        "| Year | Project | Reference | Archive Approved | Archive Actual | Public Target | Adjustment Needed | Status | Note |",
        "|---|---|---|---:|---:|---:|---:|---|---|",
    ]
    for row in rows:
        lines.append(
            f"| {row.year} | {row.project} | {row.reference or '—'} | {currency(row.archive_approved)} | {currency(row.archive_actual)} | {currency(row.public_target)} | {currency(row.adjustment_needed)} | {row.status} | {row.note} |"
        )
    lines.append("")
    lines.append("Projects marked `reported / reconstructed; see basis` retain their detailed category schedules and evidence qualifications in the project reports; they do not establish verified spending or a current account balance. Projects marked `reported; document review pending` contain qualified summaries while revised documents are reviewed; proposed item prices are excluded. Projects marked `under review` have no numeric public target in this worksheet. Projects marked `adjusted` should be reviewed with receipts, bank/mobile money history, or staff confirmation before publication as a final spend record.")
    lines.append("")
    return "\n".join(lines)


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
    if isinstance(value, (int, float)) and not isinstance(value, bool):
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
        workbook_sheets.append(f'<sheet name="{xml_escape(name)}" sheetId="{index}" r:id="rId{index}"/>')
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

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", "".join(content_types))
        zf.writestr("_rels/.rels", rels_root)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", "".join(workbook_rels))
        for index, (_, rows) in enumerate(sheets, start=1):
            zf.writestr(f"xl/worksheets/sheet{index}.xml", sheet_xml(rows))


def main() -> None:
    rows = build_rows()
    md = write_markdown(rows)
    OUT_MD.write_text(md, encoding="utf-8")
    payload = [
        {
            "year": row.year,
            "project": row.project,
            "reference": row.reference,
            "archive_approved": row.archive_approved,
            "archive_actual": row.archive_actual,
            "public_target": row.public_target,
            "adjustment_needed": row.adjustment_needed,
            "status": row.status,
            "note": row.note,
        }
        for row in rows
    ]
    OUT_JSON.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    with OUT_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow([
            "Year",
            "Project",
            "Reference",
            "Archive Approved",
            "Archive Actual",
            "Public Target",
            "Adjustment Needed",
            "Status",
            "Note",
        ])
        for row in rows:
            writer.writerow([
                row.year,
                row.project,
                row.reference,
                row.archive_approved or "",
                row.archive_actual or "",
                row.public_target,
                row.adjustment_needed or "",
                row.status,
                row.note,
            ])

    summary_rows = [[
        "Year", "Project", "Reference", "Archive Approved", "Archive Actual", "Public Target", "Adjustment Needed", "Status", "Note"
    ]]
    for row in rows:
        summary_rows.append([
            row.year,
            row.project,
            row.reference,
            row.archive_approved or "",
            row.archive_actual or "",
            row.public_target,
            row.adjustment_needed or "",
            row.status,
            row.note,
        ])

    write_xlsx(OUT_XLSX, [("Budget Adjustments", summary_rows)])
    print(f"Wrote {OUT_MD.relative_to(ROOT)}")
    print(f"Wrote {OUT_XLSX.relative_to(ROOT)}")
    print(f"Wrote {OUT_CSV.relative_to(ROOT)}")
    print(f"Wrote {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
