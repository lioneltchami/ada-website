import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

// Load token from Sanity CLI config (same as `sanity` CLI uses)
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN || (() => {
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), '.config', 'sanity', 'config.json'), 'utf-8'))
    return cfg.authToken
  } catch { return undefined }
})()
if (!token) { console.error('No Sanity token found'); process.exit(1) }

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

function h3(text: string) {
  return { _type: 'block', _key: crypto.randomUUID().slice(0, 8), style: 'h3', children: [{ _type: 'span', _key: crypto.randomUUID().slice(0, 8), text }] }
}
function p(text: string) {
  return { _type: 'block', _key: crypto.randomUUID().slice(0, 8), style: 'normal', children: [{ _type: 'span', _key: crypto.randomUUID().slice(0, 8), text }] }
}

const bodyFrEsther = [
  h3('Où Esther Était Avant'),
  p("Esther Kengne avait 24 ans et vivait dans une chambre unique avec sa fille de 2 ans à Douala. Elle gagnait moins de 3$ par jour en faisant des travaux ménagers dans le quartier. Elle avait été expulsée deux fois en six mois parce qu'elle ne pouvait pas payer le loyer. Elle n'avait aucune formation professionnelle, aucune famille proche pour l'aider, et aucune idée de comment s'en sortir."),

  h3('Comment Nous Avons Rencontré Esther'),
  p("En mars 2024, une agente de santé communautaire qui connaissait la situation d'Esther l'a orientée vers notre programme. Esther était sceptique au début — elle avait déjà entendu des promesses d'aide qui n'avaient mené à rien. Mais elle est venue à notre centre d'accueil, et après une conversation avec notre équipe, elle a accepté de tenter sa chance."),

  h3('Ce Que Nous Avons Fait'),
  p("Nous avons inscrit Esther dans notre programme de coiffure de 6 mois. Le programme comprenait : une formation technique quotidienne avec une coiffeuse professionnelle, une allocation mensuelle de 15 000 CFA pour couvrir le transport et la nourriture, un mentorat individuel avec une ancienne diplômée, des cours de compétences commerciales (comptabilité de base, service client, fixation des prix), et un kit de démarrage complet à la fin de la formation. Le coût total du programme pour Esther était de 200$."),

  h3("Comment Cela L'a Aidée"),
  p("Dès le troisième mois, Esther pratiquait sur de vraies clientes sous supervision. Sa confiance s'est transformée — elle qui évitait le contact visuel lors de notre première rencontre parlait maintenant avec assurance de ses projets d'avenir. Sa mentore Carine, elle-même ancienne bénéficiaire du programme, l'a guidée non seulement dans la technique mais aussi dans la gestion du stress et la planification financière."),

  h3('Où Esther Est Maintenant'),
  p("Esther gère aujourd'hui « Esther's Beauty Corner » dans le quartier de Mokolo. Elle a plus de 40 clientes régulières et a embauché une assistante. Elle gagne entre 80 000 et 120 000 CFA par mois — soit plus de 10 fois ce qu'elle gagnait avant. Sa fille est inscrite à la maternelle. Et Esther est maintenant elle-même mentore pour deux nouvelles apprenantes du programme, transmettant ce qu'elle a reçu."),
]

const bodyFrFabrice = [
  h3('Où Fabrice Était Avant'),
  p("Fabrice a perdu sa mère à l'âge de 10 ans. Sans personne pour payer ses frais de scolarité, il a été retiré de l'école. Pendant deux ans, il transportait des charges au marché pour gagner quelques centaines de francs par jour. Il dormait chez un oncle qui le considérait comme un fardeau. À 12 ans, il avait perdu tout espoir de retourner un jour en classe."),

  h3('Comment Nous Avons Rencontré Fabrice'),
  p("En 2022, lors de notre campagne de rentrée scolaire, le directeur d'une école locale nous a remis une liste d'enfants déscolarisés du quartier. Le nom de Fabrice y figurait. Notre équipe l'a retrouvé au marché et lui a proposé une chance de reprendre ses études. Il a accepté immédiatement."),

  h3('Ce Que Nous Avons Fait'),
  p("Nous avons pris en charge les frais de scolarité de Fabrice, son uniforme et ses fournitures scolaires. Sa petite sœur a également été inscrite dans le programme. Nous lui avons attribué un mentor bénévole et organisé des cours de rattrapage intensifs pour combler les deux années perdues."),

  h3("Comment Cela L'a Aidé"),
  p("Fabrice a rattrapé son retard en un seul trimestre. Il est devenu préfet de classe et a rejoint le club de débat. À 15 ans, il est devenu le plus jeune mentor bénévole de notre programme, aidant d'autres élèves en difficulté à rester motivés et à suivre leurs cours."),

  h3('Où Fabrice Est Maintenant'),
  p("Fabrice est en 4ème année du secondaire. Il encadre bénévolement 3 jeunes élèves du programme ADA. Il prévoit de devenir ingénieur. Sa petite sœur, également soutenue par le programme, est classée 2ème de sa classe. Fabrice dit souvent : « ADA m'a rendu ma vie. Maintenant je veux aider les autres à retrouver la leur. »"),
]

async function main() {
  // Verify posts exist
  const posts = await client.fetch(`*[_id in ["post-2","post-18"]]{_id, title}`)
  console.log('Found posts:', posts.map((p: any) => `${p._id}: ${p.title}`))

  if (posts.length !== 2) {
    console.error('Expected 2 posts, found', posts.length)
    process.exit(1)
  }

  // Patch post-2
  await client.patch('post-2').set({
    titleFr: 'Rencontrez Esther : De Sans-Abri à Propriétaire de Salon en 18 Mois',
    excerptFr: "Esther Kengne avait 24 ans, vivait dans une chambre avec sa fille de 2 ans et gagnait moins de 3$ par jour. Après 6 mois de formation ADA, elle gère aujourd'hui son propre salon de coiffure.",
    bodyFr: bodyFrEsther,
  }).commit()
  console.log('✅ post-2 patched with French translation')

  // Patch post-18
  await client.patch('post-18').set({
    titleFr: "Fabrice, 16 Ans : L'Élève Devenu Mentor",
    excerptFr: "Fabrice a perdu sa mère à 10 ans et a été retiré de l'école. Aujourd'hui, il est préfet de classe et mentor bénévole pour 3 jeunes élèves ADA.",
    bodyFr: bodyFrFabrice,
  }).commit()
  console.log('✅ post-18 patched with French translation')
}

main().catch(e => { console.error(e); process.exit(1) })
