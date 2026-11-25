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

// The six 2025 records below follow the dates and scope confirmed for the archive.
// Planning details do not establish purchases, quantities delivered or attendance.
export const archiveEditorialRecent = {
  "back-to-school-bamenda-aug-2025": story([
    "On August 30, 2025, we held our first Back to School Outreach in Bamenda.",
    "We wanted to help pupils start the new school year with the basic materials they need in class.",
    "We organized this as a separate outreach from Buea. Our Bamenda plan covered school supplies and transport.",
    "We can confirm the date and city of the outreach. We do not have a confirmed school name, number of pupils or list of items distributed.",
  ], [
    "Le 30 août 2025, nous avons mené notre première action de rentrée scolaire à Bamenda.",
    "Nous voulions aider les élèves à commencer l’année scolaire avec le matériel de base dont ils ont besoin en classe.",
    "Cette action était distincte de celle de Buea. Notre plan pour Bamenda prévoyait des fournitures scolaires et le transport.",
    "Nous pouvons confirmer la date et la ville. Le nom de l’école, le nombre d’élèves et la liste des articles distribués n’ont pas été confirmés.",
  ]),
  "back-to-school-buea-2025": story([
    "On August 30, 2025, we held a Back to School Outreach in Buea, separate from the one in Bamenda.",
    "We wanted to ease the cost of preparing for the school year and help pupils have the basics they need in class.",
    "Our team prepared a supply list for Buea, including exercise books, writing supplies and school bags.",
    "We can confirm the date and city of the outreach. We do not have a confirmed school name, number of pupils or list of items distributed.",
  ], [
    "Le 30 août 2025, nous avons mené une action de rentrée scolaire à Buea, distincte de celle de Bamenda.",
    "Nous voulions alléger les frais de rentrée et aider les élèves à disposer du matériel de base pour la classe.",
    "Notre équipe a préparé une liste pour Buea qui comprenait des cahiers, du matériel d’écriture et des cartables.",
    "Nous pouvons confirmer la date et la ville. Le nom de l’école, le nombre d’élèves et la liste des articles distribués n’ont pas été confirmés.",
  ]),
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
    "On March 29, 2025, we held a hospital outreach for nursing mothers in Muea, Buea.",
    "We wanted to support mothers as they cared for their babies and help with everyday needs.",
    "Our team gave out buckets, diapers and other supplies for mothers and their babies.",
    "We reached about 15 mothers. We budgeted 150,000 FCFA for the outreach. We do not have a verified spending total.",
  ], [
    "Le 29 mars 2025, nous avons mené une action à l’hôpital de Muea, à Buea, auprès de mères qui allaitent.",
    "Nous voulions épauler ces mères dans les soins à leurs bébés et leur apporter une aide pour les besoins du quotidien.",
    "Notre équipe a remis des seaux, des couches et d’autres articles destinés aux mères et à leurs bébés.",
    "Environ 15 mères ont reçu cette aide. Le budget de l’action était de 150 000 FCFA. Le total des dépenses n’a pas été vérifié.",
  ]),
  "city-cleanup-may-2025": story([
    "On May 3, 2025, we held our Labour Day School Cleanup at Lycée de Buea and Buea Technical Training College.",
    "We wanted to give back to the schools and care for the spaces their students and staff use every day.",
    "Our team focused the cleanup on the two school sites.",
    "We can confirm the date and both schools. We do not have a confirmed volunteer count or measures of waste collected.",
  ], [
    "Le 3 mai 2025, nous avons organisé notre nettoyage pour la fête du Travail au Lycée de Buea et au Buea Technical Training College.",
    "Nous voulions apporter notre aide aux établissements et prendre soin des espaces que leurs élèves et leur personnel utilisent au quotidien.",
    "Notre équipe a concentré le nettoyage sur les deux sites scolaires.",
    "Nous pouvons confirmer la date et les deux établissements. Le nombre de bénévoles et la quantité de déchets ramassés n’ont pas été confirmés.",
  ]),
  "christmas-orphanage-outreach-2025": story([
    "On the weekend of December 20–21, 2025, our team visited an orphanage in Buea.",
    "We wanted to spend time with the children during the holidays and offer practical support.",
    "Our team prepared supplies for the visit. The planning list shows what we considered bringing, not a confirmed record of what was handed out.",
    "We can confirm the visit took place in Buea before Christmas. We do not have a confirmed day, institution name or number of children reached.",
  ], [
    "Le week-end des 20 et 21 décembre 2025, notre équipe a rendu visite à un orphelinat à Buea.",
    "Nous voulions passer du temps avec les enfants pendant les fêtes et apporter une aide concrète.",
    "Notre équipe a préparé les fournitures pour la visite. La liste de préparation indique ce que nous envisagions d’apporter, pas les articles effectivement remis.",
    "Nous pouvons confirmer que la visite a eu lieu à Buea avant Noël. Le jour précis, le nom de l’établissement et le nombre d’enfants accompagnés n’ont pas été confirmés.",
  ]),
  "back-to-school-buea-aug-2026": story([
    "We announced a back-to-school outreach in Buea for August 2026.",
    "The aim was to help children whose families needed support with school essentials before classes resumed.",
    "The outreach flyer listed an August planning window and described a campaign focused on school supplies.",
    "The planning window has passed. This page does not establish a distribution date, the number of pupils reached or what they received.",
  ], [
    "Nous avons annoncé une action de rentrée scolaire à Buea pour août 2026.",
    "L’objectif était d’aider, avant la reprise des cours, les enfants dont les familles avaient besoin d’un soutien pour acheter les fournitures de base.",
    "Le dépliant de l’action indiquait une période prévue en août et présentait une campagne centrée sur les fournitures scolaires.",
    "La période prévue est passée. Cette page ne confirme ni la date de distribution, ni le nombre d’élèves accompagnés, ni ce qu’ils ont reçu.",
  ]),
  "back-to-school-bamenda-aug-2026": story([
    "We announced a back-to-school outreach for Mile 4 Nkwen in Bamenda for late August 2026.",
    "We wanted children who needed school materials to have a better start to the new school year.",
    "The outreach flyer set out a planned window in late August and identified school supplies as the focus.",
    "The flyer documents the plan, not delivery. The actual date, items distributed and number of pupils reached are not confirmed here.",
  ], [
    "Nous avons annoncé une action de rentrée scolaire à Mile 4 Nkwen, à Bamenda, pour la fin du mois d’août 2026.",
    "Nous voulions aider les enfants qui manquaient de matériel à bien commencer la nouvelle année scolaire.",
    "Le dépliant indiquait une période prévue à la fin du mois d’août et présentait la fourniture de matériel scolaire comme le principal objectif.",
    "Le dépliant présente le projet, pas sa réalisation. La date effective, les articles distribués et le nombre d’élèves accompagnés ne sont pas confirmés ici.",
  ]),
  "education-orphans": story([
    "This archive entry describes our education support program for children who have lost one or both parents, in Douala.",
    "The program was intended to help children stay in school when families or caregivers needed support with school costs and materials.",
    "The program description lists school supplies, uniforms, help with fees and mentoring as forms of support.",
    "The archive lists the program as complete. No project report is linked here to confirm what each child received or to assess education outcomes.",
  ], [
    "Cette entrée d’archives présente notre programme de soutien scolaire à Douala pour les enfants qui ont perdu un parent ou leurs deux parents.",
    "Le programme visait à aider les enfants à poursuivre leur scolarité lorsque les personnes qui s’occupaient d’eux avaient besoin d’un appui pour couvrir les frais ou acheter le matériel scolaire.",
    "La description du programme mentionne des fournitures scolaires, des uniformes, une aide pour les frais et du mentorat.",
    "Les archives indiquent que le programme est achevé. Aucun rapport de projet n’est accessible ici pour confirmer ce que chaque enfant a reçu ou évaluer les résultats scolaires.",
  ]),
  "girls-dignity-menstrual-health-bamenda-jun-2026": story([
    "The archive lists a menstrual health and dignity outreach planned for girls in Bamenda in June 2026.",
    "We wanted to make menstrual supplies easier to access and give girls a place to ask questions about hygiene and self-care.",
    "The proposal paired a short educational session with practical items such as hygiene kits, buckets, soap and underwear.",
    "The entry describes the planned outreach. It does not confirm how many girls took part or which items were distributed.",
  ], [
    "Les archives présentent une action de sensibilisation à la santé et à la dignité menstruelles prévue pour les filles à Bamenda en juin 2026.",
    "Nous voulions faciliter l’accès aux produits d’hygiène menstruelle et permettre aux filles de poser leurs questions sur l’hygiène et les soins personnels.",
    "Le projet associait une courte séance de sensibilisation à des articles pratiques, notamment des trousses d’hygiène, des seaux, du savon et des sous-vêtements.",
    "Cette entrée décrit l’action prévue. Elle ne confirme ni le nombre de participantes ni les articles distribués.",
  ]),
};
