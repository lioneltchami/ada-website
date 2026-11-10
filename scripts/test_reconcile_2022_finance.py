import unittest
from types import SimpleNamespace
from reconcile_2022_finance import candidates, reconcile_ledger, reconcile_budget, ledger_records
class Reconciliation(unittest.TestCase):
 def test_released_six_public_accounts(self):
  self.assertEqual(len(list(candidates())),6)
  old=[SimpleNamespace(slug='unrelated',year=2023)]
  self.assertIs(reconcile_ledger(old)[0],old[0])
  self.assertIs(reconcile_budget(old)[0],old[0])
 def test_six_arithmetic_and_currency(self):
  rows=list(candidates(True));self.assertEqual(len(rows),6)
  self.assertEqual([f['schedule_total'] for f,_ in rows],[215000,220000,180000,342750,205000,360000])
  for f,_ in rows:self.assertEqual(f['currency'],'XAF');self.assertIsNone(f['current_account_balance'])
 def test_no_plan_as_actual(self):
  for row in ledger_records(True):
   self.assertIsNone(row.actual_cfa);self.assertIsNone(row.approved_budget_cfa)
   for line in row.line_items:self.assertIsNone(line['actual_cfa'])
 def test_other_years_unchanged_and_may_non_cash(self):
  old=[SimpleNamespace(slug='2021-record',year=2021),SimpleNamespace(slug='2023-record',year=2023)]
  result=reconcile_ledger(old,True)
  self.assertIs(result[0],old[0]);self.assertIs(result[1],old[1])
  may=list(candidates(True))[2][0]
  self.assertIsNone(may['reported_funding']);self.assertIsNone(may['historical_balance'])
  self.assertEqual(sum(x['amount_xaf'] for x in may['lines'] if x['kind']=='cash allocation'),165000)
 def test_may_date_reaches_ledger_without_changing_financial_basis(self):
  from build_project_ledger import build_markdown
  records=ledger_records(True)
  may=next(r for r in records if r.slug=='school-visit-may-2022')
  self.assertEqual(may.period,'2022-05-11')
  self.assertIn('2022-05-11',build_markdown(records))
  self.assertEqual(sum(x['amount_cfa'] for x in may.line_items),180000)
  self.assertIsNone(may.actual_cfa)
 def test_released_ledger_copy_matches_qualified_schedules(self):
  from build_project_ledger import build_markdown
  text=build_markdown(ledger_records(True))
  self.assertIn('6 evidence-qualified project accounts',text)
  self.assertNotIn('Under reconciliation',text)
  self.assertNotIn('previous itemized table',text)
  self.assertNotIn('projects remain under reconciliation',text)
  self.assertEqual(text.count('Detailed evidence-qualified account'),6)
  self.assertIn('Blank summary cells do not mean zero spending',text)
if __name__=='__main__':unittest.main()
