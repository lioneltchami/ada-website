"""Replace superseded 2024 export records with the published budget-only accounts."""
import json
from pathlib import Path

from outreach_naming import outreach_display_title

ROOT = Path(__file__).resolve().parents[1]
FINANCE_BASIS = "itemized budget published; not actual expenditure"


def records():
    config = json.loads((ROOT / "config/project-records-2024-25.json").read_text(encoding="utf-8"))
    return [p for p in config["projects"] if p["year"] == 2024 and p.get("documentStatus") == "released"]


def reconcile_ledger(projects):
    from build_project_ledger import ProjectRecord
    selected = records()
    slugs = {p["slug"] for p in selected}
    result = [p for p in projects if p.slug not in slugs]
    for p in selected:
        result.append(ProjectRecord(
            slug=p["slug"], title=outreach_display_title(p["slug"], p["title"]), reference="", year=p["year"], period=p["date"],
            location=p["location"], beneficiaries="", status="completed",
            approved_budget_cfa=p["approvedBudgetFcfa"], actual_cfa=None, variance_cfa=None,
            utilization_pct=None, what_we_did=p["description"], outcomes="",
            finance_note=p["financialNote"], finance_basis=FINANCE_BASIS,
            report_path=f'/docs/projects/{p["slug"]}/report.pdf', financial_path="", line_items=[],
        ))
    return result


def reconcile_budget(rows):
    from build_public_budget_corrections import BudgetRow
    return [
        *rows,
        *(BudgetRow(
            year=p["year"], project=outreach_display_title(p["slug"], p["title"]), reference="", archive_approved=p["approvedBudgetFcfa"],
            archive_actual=None, public_target=None, adjustment_needed=None,
            status=FINANCE_BASIS, note=p["financialNote"],
        ) for p in records()),
    ]
