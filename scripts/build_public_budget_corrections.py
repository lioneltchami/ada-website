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
    public_target: int
    adjustment_needed: int | None
    status: str
    note: str


def build_rows() -> list[BudgetRow]:
    rows: list[BudgetRow] = []
    for slug_dir in sorted(p for p in PROJECTS_DIR.iterdir() if p.is_dir()):
        project = parse_project(slug_dir)
        if not project:
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
    return rows


def write_markdown(rows: list[BudgetRow]) -> str:
    total_archive = sum((r.archive_actual or r.archive_approved or 0) for r in rows)
    total_public = sum(r.public_target for r in rows)
    lines = [
        "# ADA Public Budget Adjustments",
        "",
        "This sheet is the sponsor-facing budget layer. It keeps the archive intact, but caps each project at the realistic public ceiling of 400,000 CFA unless the archived figure is already below that ceiling.",
        "",
        f"Compiled on {date.today().strftime('%B')} {date.today().day}, {date.today().year}.",
        "",
        f"Archived project total represented here: {currency(total_archive)}.",
        f"Public target total after cap: {currency(total_public)}.",
        "",
        "| Year | Project | Reference | Archive Approved | Archive Actual | Public Target | Adjustment Needed | Status | Note |",
        "|---|---|---|---:|---:|---:|---:|---|---|",
    ]
    for row in rows:
        lines.append(
            f"| {row.year} | {row.project} | {row.reference or '—'} | {currency(row.archive_approved)} | {currency(row.archive_actual)} | {currency(row.public_target)} | {currency(row.adjustment_needed)} | {row.status} | {row.note} |"
        )
    lines.append("")
    lines.append("Projects marked `adjusted` should be reviewed with receipts, bank/mobile money history, or staff confirmation before publication as a final spend record.")
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
        writer = csv.writer(f)
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
