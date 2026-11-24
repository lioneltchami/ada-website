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

// The 2024–25 reconciliation and owner confirmations govern the five reviewed
// 2025 entries. Use planning scope, not output claims, for other older records
// (the existing ToRs and 2026 program descriptions).
export const archiveEditorialRecent = {
  "back-to-school-bamenda-aug-2025": story([
    "On August 29, 2025, we held our first back-to-school outreach in Bamenda.",
    "We wanted to help pupils start the new school year with the basic materials they need in class.",
    "We organized this as a separate local outreach and planned for school supplies and transport.",
    "The date and location are confirmed. We do not yet have a confirmed count of the pupils who received supplies.",
  ], [
    "Le 29 août 2025, nous avons mené notre première action de rentrée scolaire à Bamenda.",
    "Nous voulions aider les élèves à commencer l’année scolaire avec le matériel de base dont ils ont besoin en classe.",
    "Nous avons organisé une action distincte sur place et prévu des fournitures scolaires ainsi que le transport.",
    "La date et le lieu sont confirmés. Nous n’avons pas encore de décompte confirmé des élèves qui ont reçu des fournitures.",
  ]),
  "back-to-school-buea-2025": story([
    "In 2025, we held a back-to-school outreach in Buea, separate from the one in Bamenda.",
    "Having the basics on hand helps pupils prepare for the first weeks of school. That was the focus of this outreach.",
    "Our team planned around essential school supplies for pupils in Buea and prepared a separate list for this project.",
    "We can confirm the 2025 outreach in Buea. We do not yet have the exact date, the number of pupils reached, or a confirmed breakdown of what was distributed.",
  ], [
    "En 2025, nous avons mené une action de rentrée scolaire à Buea, distincte de celle de Bamenda.",
    "Avoir le matériel de base aide les élèves à se préparer aux premières semaines de classe. C’était le but de cette action.",
    "Notre équipe a prévu des fournitures scolaires essentielles pour les élèves de Buea et a préparé une liste propre à ce projet.",
    "Nous pouvons confirmer l’action de 2025 à Buea. Nous n’avons pas encore la date exacte, le nombre d’élèves accompagnés ni le détail confirmé de la distribution.",
  ]),
  "womens-day-widows-outreach-2025": story([
    "Around International Women’s Day in 2025, we organized an outreach for widows.",
    "We wanted to mark the occasion by offering practical support for everyday household needs.",
    "Our plan set aside food and fabric for household use. We have not yet established exactly what was distributed.",
    "The outreach took place around International Women’s Day. The exact date, venue and number of participants are not confirmed.",
  ], [
    "À l’occasion de la Journée internationale des femmes en 2025, nous avons organisé une action de soutien aux veuves.",
    "Nous voulions marquer cette journée en apportant une aide concrète pour les besoins quotidiens des ménages.",
    "Notre projet prévoyait des denrées alimentaires et du tissu pour les ménages. Le détail de la distribution n’est pas encore établi.",
    "L’action a eu lieu à l’occasion de la Journée internationale des femmes. La date exacte, le lieu et le nombre de participantes ne sont pas confirmés.",
  ]),
  "hospital-outreach-mothers-muea-2025": story([
    "In 2025, we organized an outreach for mothers at the hospital in Muea, Buea.",
    "We wanted to support mothers and their newborns with practical items they could use right away.",
    "Our preparations included diapers, buckets and hygiene supplies. The planning notes document the items we intended to provide.",
    "Our team recalls reaching about 15 mothers. That is a recollection, not a count from an attendance record.",
  ], [
    "En 2025, nous avons organisé une action de soutien aux mères à l’hôpital de Muea, à Buea.",
    "Nous voulions aider les mères et leurs nouveau-nés avec des articles utiles dès les premiers jours.",
    "Nos préparatifs comprenaient des couches, des seaux et des produits d’hygiène. Les notes de préparation indiquent les articles que nous comptions fournir.",
    "Notre équipe se souvient d’avoir accompagné environ 15 mères. Il s’agit d’un souvenir, pas d’un décompte tiré d’un registre de présence.",
  ]),
  "christmas-orphanage-outreach-2025": story([
    "Before Christmas in December 2025, our team visited an orphanage in Buea as part of our year-end outreach.",
    "We wanted to spend time with the children during the holidays and offer practical support.",
    "Our team prepared supplies for the visit. The planning list shows what we considered bringing, not a confirmed record of what was handed out.",
    "We can confirm the visit took place in Buea before Christmas. The precise date, the institution’s name and the number of children reached are still under review.",
  ], [
    "Avant Noël, en décembre 2025, notre équipe a rendu visite à un orphelinat à Buea dans le cadre de nos actions de fin d’année.",
    "Nous voulions passer du temps avec les enfants pendant les fêtes et apporter une aide concrète.",
    "Notre équipe a préparé des fournitures pour la visite. La liste de préparation indique ce que nous envisagions d’apporter, pas ce qui a été effectivement remis.",
    "Nous pouvons confirmer que la visite a eu lieu à Buea avant Noël. La date précise, le nom de l’établissement et le nombre d’enfants accompagnés restent à vérifier.",
  ]),
  "campus-cleanup-aug-2025": story([
    "The 2025 archive includes a campus cleanup project in Buea.",
    "The aim was to care for spaces students share and to encourage regular upkeep of the campus.",
    "The project plan called for volunteers to clean the grounds, collect waste and put bins in place for continued use.",
    "The plan establishes what was intended, but we have not yet confirmed the activity dates, how many people took part or what was completed.",
  ], [
    "Les archives de 2025 comprennent un projet de nettoyage d’un campus à Buea.",
    "Le projet visait à prendre soin des espaces partagés par les étudiants et à encourager l’entretien régulier du campus.",
    "Le projet prévoyait que des bénévoles nettoient le site, ramassent les déchets et installent des poubelles qui resteraient à disposition.",
    "Le document de préparation indique ce qui était prévu. Les dates, le nombre de participants et les travaux réalisés restent à vérifier.",
  ]),
  "city-cleanup-may-2025": story([
    "This archive entry records plans for a Labour Day cleanup in Buea in 2025.",
    "The aim was to care for streets and sidewalks shared by residents, traders and visitors.",
    "The plan called for volunteers to sweep, collect waste and place bins for public use.",
    "We have a plan for this edition. Its delivery details and results have not yet been confirmed.",
  ], [
    "Cette entrée d’archives présente le nettoyage prévu à Buea pour la fête du Travail en 2025.",
    "L’objectif était de prendre soin des rues et des trottoirs utilisés par les habitants, les commerçants et les visiteurs.",
    "Le projet prévoyait que des bénévoles balaient les rues, ramassent les déchets et mettent des poubelles à la disposition du public.",
    "Nous disposons du plan de cette édition. Les détails de sa réalisation et ses résultats n’ont pas encore été confirmés.",
  ]),
  "idp-children-education-fund": story([
    "The 2025 archive includes an education fund for children from internally displaced families in Bamenda.",
    "The fund was designed to help families meet education costs after displacement and to help children continue attending school.",
    "The plan called for help with school fees, uniforms and learning materials, with follow-up through schools and families.",
    "The records describe the proposed support. The number of children funded and their enrollment or attendance outcomes are not confirmed here.",
  ], [
    "Les archives de 2025 comprennent un fonds pour la scolarisation des enfants de familles déplacées à Bamenda.",
    "Le fonds visait à aider les familles à faire face aux frais de scolarité après leur déplacement et à permettre aux enfants de poursuivre leur scolarité.",
    "Le projet prévoyait une aide pour les frais de scolarité, les uniformes et le matériel pédagogique, avec un suivi auprès des écoles et des familles.",
    "Les documents décrivent l’aide envisagée. Le nombre d’enfants financés ainsi que les inscriptions et l’assiduité ne sont pas confirmés ici.",
  ]),
  "prenatal-care-support-program": story([
    "This archive entry describes a prenatal support program for pregnant women in Bamenda.",
    "The program was designed to address practical barriers to accessing prenatal care, including the cost of appointments and supplies.",
    "The plan proposed working with local clinics to help cover checkups and delivery costs and to provide supplies after birth.",
    "This entry documents the program’s intended support. We are not reporting a confirmed participant count or health outcomes.",
  ], [
    "Cette entrée d’archives présente un programme de soutien prénatal pour les femmes enceintes à Bamenda.",
    "Le programme visait à réduire les obstacles à l’accès aux soins prénatals, notamment le coût des consultations et des produits nécessaires.",
    "Le projet prévoyait de travailler avec des cliniques locales pour aider à couvrir les frais de consultation et d’accouchement et fournir des articles après la naissance.",
    "Cette entrée décrit l’aide envisagée. Nous ne présentons ni nombre confirmé de participantes ni résultats sur leur santé.",
  ]),
  "youth-mentorship-seminar-oct-2025": story([
    "The 2025 archive includes a youth mentorship seminar planned for boys and young men in Buea.",
    "The aim was to give young people positive role models and a place to learn practical life skills and explore faith together.",
    "The program outline combined guided discussions, skills sessions and Bible study.",
    "The outline describes the proposed sessions. Dates, attendance and results still need confirmation.",
  ], [
    "Les archives de 2025 comprennent un séminaire de mentorat prévu pour des garçons et des jeunes hommes à Buea.",
    "L’objectif était de leur proposer des modèles positifs et un espace pour acquérir des compétences utiles au quotidien et réfléchir ensemble à la foi.",
    "Le programme prévoyait des échanges encadrés, des séances sur les compétences de la vie courante et des études bibliques.",
    "Le programme décrit les séances envisagées. Les dates, la participation et les résultats restent à confirmer.",
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
