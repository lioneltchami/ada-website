"""Evidence-aware 2022 adapter. Staged previews never write public output."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def candidates(include_staged=False):
    manifest = json.loads((ROOT / 'config/project-document-releases.json').read_text())
    finance = json.loads((ROOT / 'config/project-finance-2022.json').read_text())
    releases = {p['slug']: p for p in manifest['projects']}
    for f in finance:
        if f['currency'] != 'XAF' or f['year'] != 2022:
            raise ValueError('Only XAF 2022 figures allowed')
        if sum(line['amount_xaf'] for line in f['lines']) != f['schedule_total']:
            raise ValueError('Schedule arithmetic mismatch: ' + f['slug'])
        if f['current_account_balance'] is not None:
            raise ValueError('Historical project accounts cannot establish current account balance')
        r = releases[f['slug']]
        if include_staged or r['status'] == 'released':
            yield f, r

def ledger_records(include_staged=False):
    from build_project_ledger import ProjectRecord
    result=[]
    for f,r in candidates(include_staged):
        a=r['archive']; url=f"/docs/projects/{f['slug']}/report.pdf"
        # Legacy summary columns cannot distinguish planned/reported/reconstructed. Keep
        # them blank; exact amounts and their bases remain visible in notes/details.
        items=[dict(year=2022,project=a['title'],reference=f['reference'],section='Detailed schedule (XAF)',table_header='Category / Amount XAF / Basis',detail_type=line['kind'],item=line['category'],amount_cfa=line['amount_xaf'],budget_cfa=None,actual_cfa=None,variance_cfa=None,notes=line['basis']+'; '+f['note'],source=url) for line in f['lines']]
        result.append(ProjectRecord(slug=f['slug'],title=a['title'],reference=f['reference'],year=2022,period=a['startDate'] or 'July 2022; day not established',location=a['location'],beneficiaries='See qualified reach in project report',status='completed',approved_budget_cfa=None,actual_cfa=None,variance_cfa=None,utilization_pct=None,what_we_did=a['description'],outcomes='',finance_note=f['note'],report_path=url,financial_path=url,line_items=items,finance_basis="evidence-qualified"))
    return result

def reconcile_ledger(projects, include_staged=False):
    replacements=ledger_records(include_staged)
    slugs={p.slug for p in replacements}
    return [p for p in projects if p.slug not in slugs]+replacements

def reconcile_budget(rows, include_staged=False):
    from build_public_budget_corrections import BudgetRow
    selected=list(candidates(include_staged)); refs={f['reference'] for f,_ in selected}
    # Never apply the old public cap to reconstructed schedules or transfers.
    return [r for r in rows if not(r.year==2022 and r.reference in refs)]+[
        BudgetRow(year=2022,project=r['archive']['title'],reference=f['reference'],archive_approved=None,archive_actual=None,public_target=None,adjustment_needed=None,status='reported / reconstructed; see basis',note=f['note']) for f,r in selected]

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',required=True);args=parser.parse_args()
    out=Path(args.output_dir).resolve()
    if out.is_relative_to(ROOT / 'public'):
        raise ValueError('Staged finance preview must remain outside public/')
    out.mkdir(parents=True,exist_ok=True)
    records=[dict(f, period=r['archive']['startDate'] or 'July 2022; day not established') for f,r in candidates(True)]
    (out/'finance-2022.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n')
    lines=['# Private 2022 financial reconciliation preview','', 'All amounts XAF. No aggregate current account balance is asserted.','']
    for f,r in candidates(True):
        lines += ['## '+r['archive']['title'],'', 'Period: '+(r['archive']['startDate'] or 'July 2022; day not established')+'.', '', f['note'],'','| Category | XAF | Basis |','|---|---:|---|']
        lines += [f"| {x['category']} | {x['amount_xaf']:,} | {x['basis']}; {x['kind']} |" for x in f['lines']]
        lines += ['',f"Schedule total: {f['schedule_total']:,} XAF ({f['schedule_basis']}).",'']
    (out/'finance-2022.md').write_text('\n'.join(lines))
    print(f'Wrote private six-project preview: {out}')
