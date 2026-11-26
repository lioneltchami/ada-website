type Narrative = [lead: string, why: string, how: string, what: string];

function story(en: Narrative, fr: Narrative) {
  const localized = ([lead, why, how, what]: Narrative, titles: [string, string, string]) => ({
    lead,
    sections: [why, how, what].map((text, i) => ({ title: titles[i], text })),
  });
  return {
    en: localized(en, ["Why we did it", "How we did the work", "What we can report"]),
    fr: localized(fr, ["Pourquoi nous avons agi", "Comment nous avons procédé", "Ce que nous pouvons rapporter"]),
  };
}

// The three 2025 records below follow the dates and scope confirmed for the archive.
// Planning details do not establish purchases, quantities delivered or attendance.
export const archiveEditorialRecent = {
  "womens-day-widows-outreach-2025": story([
    "On March 15, 2025, we held a Women’s Day outreach for widows.",
    "We wanted to mark the occasion by offering practical help with everyday household needs.",
    "Our supply plan included fabric, handbags, rice and groundnut oil.",
    "We can confirm the date. We do not have a confirmed venue, number of participants or list of items distributed.",
  ], [
    "Le 15 mars 2025, nous avons mené une action de soutien aux veuves à l’occasion de la Journée internationale des femmes.",
    "Nous voulions marquer cette journée en apportant une aide concrète pour les besoins quotidiens des ménages.",
    "La liste de préparation comprenait du tissu, des sacs à main, du riz et de l’huile d’arachide.",
    "Nous pouvons confirmer la date. Le lieu, le nombre de participantes et la liste des articles distribués n’ont pas été confirmés.",
  ]),
  "prenatal-care-support-program": story([
    "On July 26, 2025, we held a hospital outreach for nursing mothers in Muea, Buea.",
    "We wanted to support mothers as they cared for their babies and help with everyday needs.",
    "Our team gave out buckets, diapers and other supplies for mothers and their babies.",
    "We reached about 15 mothers. We budgeted 150,000 FCFA for the outreach. We do not have a verified spending total.",
  ], [
    "Le 26 juillet 2025, nous avons mené une action à l’hôpital de Muea, à Buea, auprès de mères qui allaitent.",
    "Nous voulions épauler ces mères dans les soins à leurs bébés et leur apporter une aide pour les besoins du quotidien.",
    "Notre équipe a remis des seaux, des couches et d’autres articles destinés aux mères et à leurs bébés.",
    "Environ 15 mères ont reçu cette aide. Le budget de l’action était de 150 000 FCFA. Le total des dépenses n’a pas été vérifié.",
  ]),
  "city-cleanup-may-2025": story([
    "On May 1, 2025, we held our Labour Day School Cleanup at Lycée de Buea and Buea Technical Training College.",
    "We wanted to give back to the schools and care for the spaces their students and staff use every day.",
    "We bought cutlasses, brooms, buckets, rakes and other tools for the cleanup at the two schools.",
    "We budgeted about 50,000 FCFA for the cleanup. We do not have a verified total for what we spent.",
  ], [
    "Le 1ᵉʳ mai 2025, nous avons organisé notre nettoyage pour la fête du Travail au Lycée de Buea et au Buea Technical Training College.",
    "Nous voulions apporter notre aide aux établissements et prendre soin des espaces que leurs élèves et leur personnel utilisent au quotidien.",
    "Nous avons acheté des machettes, des balais, des seaux, des râteaux et d’autres outils pour le nettoyage des deux établissements.",
    "Nous avons prévu un budget d’environ 50 000 FCFA pour le nettoyage. Le total des dépenses n’a pas été vérifié.",
  ]),
  "back-to-school-buea-aug-2026": story([
    "On 12 September 2026, our team shared school supplies with children in the Bilaka community of Buea.",
    "Buying school supplies can be a strain for families at the start of the school year. We wanted children to have the basics they needed in class.",
    "Our team went to Bilaka to hand out school supplies. This was a distribution of materials rather than school-fee support.",
    "We reached about 15 children. The report shows a proposed breakdown of our supplies budget, not the final amount paid for each item.",
  ], [
    "Le 12 septembre 2026, notre équipe a distribué des fournitures scolaires aux enfants de la communauté de Bilaka, à Buea.",
    "L’achat des fournitures scolaires peut peser sur les familles à la rentrée. Nous voulions que les enfants disposent du matériel de base nécessaire en classe.",
    "Notre équipe s’est rendue à Bilaka pour remettre les fournitures. Cette action portait sur le matériel scolaire, et non sur les frais de scolarité.",
    "Nous avons accompagné environ 15 enfants. Le rapport propose une répartition du budget des fournitures, sans indiquer le montant effectivement payé pour chaque article.",
  ]),
  "back-to-school-bamenda-aug-2026": story([
    "On 21 November 2026, our team helped children in Bamenda with school fees during the school year.",
    "We wanted to ease the cost of schooling for families and help children stay in class.",
    "With approval from the children’s parents and the school principal, we focused on school fees rather than handing out school supplies.",
    "About 20 children received school-fee support. The 260,000 FCFA figure is the outreach budget, not the total amount paid or the amount paid per child.",
  ], [
    "Le 21 novembre 2026, en cours d’année scolaire, notre équipe a aidé des enfants de Bamenda à régler leurs frais de scolarité.",
    "Nous voulions alléger le coût de la scolarité pour les familles et aider les enfants à poursuivre leurs cours.",
    "Avec l’accord des parents et de la direction de l’établissement, nous avons privilégié l’aide aux frais de scolarité plutôt que la distribution de fournitures.",
    "Environ 20 enfants ont bénéficié de cette aide. Les 260 000 FCFA correspondent au budget de l’action, et non à la somme versée au total ou par enfant.",
  ]),
  "girls-dignity-menstrual-health-bamenda-jun-2026": story([
    "On 28 June 2026, we welcomed 20 girls to the Zion Fire Adoration Ministries Hall in Bamenda for a menstrual health discussion and a distribution of hygiene supplies.",
    "We wanted girls to have access to menstrual products and a place to ask questions about their cycle and personal hygiene.",
    "We opened with prayer. Facilitators answered questions and demonstrated how to use menstrual products. Participants could use the notebooks and pens we provided to take notes.",
    "We prepared 26 hygiene parcels and gave one to each of the 20 girls who attended. The remaining parcels do not count as distributions. The report records attendance and supplies, not long-term outcomes.",
  ], [
    "Le 28 juin 2026, nous avons accueilli 20 filles dans la salle de Zion Fire Adoration Ministries, à Bamenda, pour un échange sur la santé menstruelle et une distribution de produits d’hygiène.",
    "Nous voulions faciliter l’accès des filles aux produits menstruels et leur offrir un espace où poser leurs questions sur leur cycle et l’hygiène personnelle.",
    "Nous avons commencé par une prière. Les personnes qui animaient la séance ont répondu aux questions et montré comment utiliser les produits menstruels. Les participantes ont reçu des cahiers et des stylos pour prendre des notes.",
    "Nous avons préparé 26 kits d’hygiène et en avons remis un à chacune des 20 participantes. Les autres kits ne sont pas comptés comme distribués. Le rapport rend compte de la participation et des fournitures, sans mesurer les effets à long terme.",
  ]),
};
