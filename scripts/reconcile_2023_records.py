"""Confirmed 2023 summaries; pending PDF review does not authorize old financial claims."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def records():
    return json.loads((ROOT / 'config/project-records-2023.json').read_text())['projects']

def reconcile_ledger(projects):
    from build_project_ledger import ProjectRecord
    selected=records()
    slugs={p['slug'] for p in selected}
    result=[p for p in projects if p.slug not in slugs]
    for p in selected:
        # The legacy numeric columns cannot distinguish funding, budgets and reported
        # expenditure. Preserve these distinctions in the qualified note instead.
        result.append(ProjectRecord(slug=p['slug'], title=p['title'], reference='',
            year=p['year'], period=p['period'], location=p['location'] or 'Not established',
            beneficiaries='Not established' if p['slug']!='christmas-giving-dec-2023' else 'Approximately 21 children, reported',
            status='completed', approved_budget_cfa=None,actual_cfa=None,variance_cfa=None,utilization_pct=None,
            what_we_did=p['description'],outcomes='',finance_note=p['financialNote'],
            report_path=f"/projects/archive/{p['slug']}/",financial_path='',line_items=[],finance_basis='reported; document review pending'))
    return result

def reconcile_budget(rows):
    from build_public_budget_corrections import BudgetRow
    # Only the three superseded static 2023 accounts can currently enter this parser.
    old_references={'ADA/2023/001','ADA/2023/003','ADA/2023/004'}
    result=[r for r in rows if not (r.year==2023 and r.reference in old_references)]
    result.extend(BudgetRow(year=2023,project=p['title'],reference='',archive_approved=None,archive_actual=None,
        public_target=None,adjustment_needed=None,status='reported; document review pending',note=p['financialNote']) for p in records())
    return result
