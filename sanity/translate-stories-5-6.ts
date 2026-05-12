import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

function block(style: string, text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
    markDefs: [],
  };
}

const post13BodyFr = [
  block('h3', 'Où David Était Avant'),
  block('normal', "David avait 8 ans quand ses deux parents sont morts dans un accident de route sur la nationale entre Douala et Bafoussam. Du jour au lendemain, il s'est retrouvé chez sa grand-mère, Mama Rose, une veuve de 67 ans vivant d'un petit jardin potager."),
  block('normal', "Les frais de scolarité de 15 000 CFA par trimestre étaient impossibles pour Mama Rose. David a manqué une année scolaire complète. Il se cachait des autres enfants du quartier qui allaient à l'école, honteux de ne pas pouvoir y aller lui-même. On le trouvait souvent en train de dessiner des lettres dans la terre avec un bâton."),

  block('h3', 'Comment Nous Avons Rencontré David'),
  block('normal', "Samuel, notre coordinateur éducation, a visité le village en juillet 2024. Le chef du village et le directeur de l'école lui ont remis une liste d'enfants déscolarisés. En se rendant chez Mama Rose, Samuel a trouvé un garçon assis par terre, dessinant des lettres dans la poussière."),

  block('h3', 'Ce Que Nous Avons Fait'),
  block('normal', "Nous avons couvert les frais de scolarité de David : 15 000 CFA par trimestre. Nous lui avons fourni un uniforme scolaire, un sac à dos avec des fournitures, et des manuels. Chaque semaine, un mentor bénévole nommé Fabrice lui rend visite pour l'aider dans ses devoirs. Nous envoyons aussi des colis alimentaires à Mama Rose chaque mois. Le coût total : 80 $ par an."),

  block('h3', "Comment Cela L'a Aidé"),
  block('normal', "David est retourné à l'école en septembre 2024. Il était l'élève le plus motivé — il arrivait toujours en avance. Avec les séances de mentorat du samedi avec Fabrice, il a rattrapé son retard en décembre. À la fin du trimestre, il était au-dessus de la moyenne en mathématiques."),

  block('h3', 'Où David Est Maintenant'),
  block('normal', "David a un taux de présence de 100 %. Il est classé 5ème sur 38 élèves. Mama Rose est en meilleure santé grâce aux colis alimentaires. David dit qu'il veut devenir enseignant. Ses frais de scolarité sont couverts pour 2025-2026."),
];

const post15BodyFr = [
  block('h3', 'Où la Famille Ndongo Était Avant'),
  block('normal', "Angeline, 35 ans, et Thomas, 38 ans, vivaient avec leurs 3 enfants dans une maison modeste à Bamenda. Le 28 mai 2024, un incendie électrique s'est déclaré pendant la nuit. La famille a échappé aux flammes mais n'a rien pu sauver."),

  block('h3', 'Comment Nous Avons Rencontré la Famille'),
  block('normal', "Un leader communautaire a appelé notre ligne d'urgence le lendemain matin. En moins de 24 heures, notre équipe a rendu visite à la famille dans l'abri d'une église locale."),

  block('h3', 'Ce Que Nous Avons Fait'),
  block('normal', "Dans les premières 48 heures : nourriture, vêtements, produits d'hygiène, matelas, et 25 000 CFA en espèces. Durant le premier mois : loyer de 30 000 CFA payé pour 3 mois, uniformes scolaires pour les enfants, documents pour la moto de Thomas, et un crédit de marché pour qu'Angeline puisse relancer son commerce. Coût total : 250 $."),

  block('h3', 'Comment Cela Les a Aidés'),
  block('normal', "La rapidité a été cruciale. Le loyer de 3 mois leur a donné le temps de respirer. Thomas a repris la moto en une semaine. Angeline a relancé son commerce en 2 semaines. Les enfants n'ont manqué que 3 jours d'école."),

  block('h3', 'Où la Famille Ndongo Est Maintenant'),
  block('normal', "La famille occupe une chambre plus grande et plus sûre. Thomas gagne sa vie avec la moto. Le commerce d'Angeline est plus grand qu'avant. Les enfants sont à l'école. Ils épargnent via le mobile money. Thomas est maintenant bénévole comme contact d'urgence pour d'autres familles."),
];

async function main() {
  console.log('Patching post-13...');
  await client.patch('post-13').set({
    titleFr: "David, 9 Ans : Le Garçon Qui a Manqué une Année d'École",
    excerptFr: "David a perdu ses parents dans un accident de route. Sa grand-mère ne pouvait pas payer l'école. Après un an sans classe, ADA l'a réinscrit — aujourd'hui il est 5ème de sa classe.",
    bodyFr: post13BodyFr,
  }).commit();
  console.log('✓ post-13 done');

  console.log('Patching post-15...');
  await client.patch('post-15').set({
    titleFr: "La Famille Ndongo : Quand l'Aide d'Urgence a Sauvé Cinq Vies",
    excerptFr: "Un incendie a détruit leur maison pendant la nuit. En 24 heures, ADA a fourni nourriture, vêtements et un logement temporaire. Aujourd'hui la famille est reconstruite.",
    bodyFr: post15BodyFr,
  }).commit();
  console.log('✓ post-15 done');
}

main().catch((e) => { console.error(e); process.exit(1); });
