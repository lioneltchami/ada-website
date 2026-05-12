import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const token = process.env.SANITY_TOKEN || JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token,
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

const post16BodyFr = [
  block('h3', 'Où Amina Était Avant'),
  block('normal', "Amina avait 12 ans et était en dernière année du primaire dans un village près de Douala. C'était une élève brillante, classée 3ème de sa classe. Mais sa vie à la maison racontait une histoire différente."),
  block('normal', "Son père est décédé quand elle avait 6 ans. Sa mère, incapable de subvenir aux besoins de la famille, l'a envoyée vivre chez son oncle. Chez lui, Amina servait de main-d'œuvre non rémunérée — elle cuisinait, nettoyait et s'occupait des enfants de son oncle avant et après l'école."),
  block('normal', "Puis son oncle a arrangé son mariage à un homme de 35 ans d'un village voisin. Le prix de la mariée avait été fixé à 200 000 CFA. Pour l'oncle, c'était une transaction commerciale. Pour Amina, c'était la fin de ses rêves."),
  block('h3', 'Comment Nous Avons Rencontré Amina'),
  block('normal', "Madame Ekane, l'institutrice d'Amina, a remarqué son retrait soudain. La fillette autrefois vive avait cessé de participer en classe et pleurait souvent pendant la récréation. Quand Madame Ekane l'a prise à part, Amina lui a tout raconté."),
  block('normal', "L'institutrice a immédiatement contacté ADA. Notre équipe s'est rendue au village dans les 3 jours. Nous savions que cette situation nécessitait une négociation délicate — confronter directement l'oncle risquait de mettre Amina en danger."),
  block('h3', 'Ce Que Nous Avons Fait'),
  block('normal', "Nous avons négocié avec l'oncle en abordant sa véritable préoccupation : le fardeau financier de s'occuper d'Amina. ADA s'est engagée à couvrir ses frais de scolarité et à contribuer à sa nourriture. Nous avons impliqué le chef du village comme médiateur pour donner du poids à l'accord."),
  block('normal', "Nous avons inscrit Amina dans notre programme éducatif, contacté sa mère pour la tenir informée, et établi Madame Ekane comme tutrice locale. Le coût total : 120 dollars par an."),
  block('h3', "Comment Cela L'a Aidée"),
  block('normal', "Le mariage a été annulé. L'oncle a accepté parce que nous avions répondu à sa véritable préoccupation — il ne pouvait pas se permettre une bouche supplémentaire à nourrir. Avec ce fardeau levé, il n'avait plus de raison de la marier."),
  block('normal', "Amina a terminé le primaire et a réussi l'examen d'entrée au secondaire. Un mentor lui rend visite chaque semaine pour s'assurer qu'elle reste sur la bonne voie et se sent soutenue."),
  block('h3', 'Où Amina Est Maintenant'),
  block('normal', "Amina a maintenant 14 ans et est en 2ème année du secondaire. Elle fait partie des 10 premières sur 45 élèves et a rejoint le club de sciences. Elle rêve toujours de devenir infirmière."),
  block('normal', "Elle vit toujours dans la famille de son oncle avec le soutien d'ADA. Sa mère lui rend visite pendant les vacances. Et Amina encadre maintenant des filles plus jeunes de son village, leur disant que l'éducation vaut la peine de se battre."),
];

const post8BodyFr = [
  block('h3', 'Où Jean-Baptiste Était Avant'),
  block('normal', "Jean-Baptiste, 67 ans, était agriculteur toute sa vie. Quand il a eu besoin d'une opération de hernie, il s'est rendu à l'hôpital seul. Sa femme était décédée trois ans plus tôt. Ses enfants vivaient à Douala, à des heures de route."),
  block('normal', "Au Cameroun, les hôpitaux fournissent les soins médicaux mais pas la nourriture. Les familles sont censées apporter les repas. Sans personne pour lui rendre visite, Jean-Baptiste n'avait pas mangé depuis 5 jours. D'autres patients partageaient occasionnellement, mais ce n'était pas suffisant."),
  block('h3', 'Comment Nous Avons Rencontré Jean-Baptiste'),
  block('normal', "L'équipe de visite hospitalière d'ADA se rend à l'hôpital deux fois par mois. Lors d'une visite de routine, Marie-Claire a remarqué qu'il n'y avait aucun effet personnel sur la table de chevet de Jean-Baptiste — pas de nourriture, pas de vêtements de rechange, pas de produits de toilette."),
  block('normal', "Les infirmières ont confirmé qu'il n'avait reçu aucun visiteur depuis son admission. Marie-Claire s'est assise avec lui pendant 30 minutes. Il a pleuré. C'était la première fois que quelqu'un lui parlait depuis des jours."),
  block('h3', 'Ce Que Nous Avons Fait'),
  block('normal', "Le jour même, nous lui avons apporté un repas et des fournitures essentielles. Pendant les deux semaines suivantes, notre équipe lui a rendu visite deux fois par semaine, apportant de la nourriture et de la compagnie."),
  block('normal', "Nous avons contacté ses enfants à Douala pour les informer de son état. Nous avons payé ses médicaments — 15 000 CFA — et organisé son transport pour rentrer chez lui. Nous l'avons connecté à un agent de santé communautaire pour le suivi. Coût total : 50 dollars."),
  block('h3', "Comment Cela L'a Aidé"),
  block('normal', "La nutrition a accéléré sa guérison, mais l'impact émotionnel a été encore plus grand. Jean-Baptiste a dit qu'il se sentait à nouveau humain. Quelqu'un se souciait de savoir s'il vivait ou mourait."),
  block('normal', "L'appel téléphonique à ses enfants a été transformateur. Son fils a immédiatement envoyé de l'argent et a promis de venir le voir. Parfois, le plus grand besoin n'est pas médical — c'est la connexion."),
  block('h3', 'Où Jean-Baptiste Est Maintenant'),
  block('normal', "Jean-Baptiste s'est complètement rétabli et est retourné à l'agriculture. Son fils lui rend visite tous les deux mois maintenant. Il est connecté à la clinique locale pour des contrôles réguliers."),
  block('normal', "Il parle d'ADA à tous ceux qu'il rencontre. Il est devenu une source informelle de référencement — quand il entend parler de quelqu'un dans le besoin, il nous appelle. Un seul acte de gentillesse a créé un défenseur permanent."),
];

async function main() {
  console.log('Patching post-16 (amina-almost-child-bride)...');
  await client.patch('post-16').set({
    titleFr: "Amina : Une Fillette de 12 Ans Qui a Failli Devenir Épouse",
    excerptFr: "L'oncle d'Amina avait arrangé son mariage à un homme de 35 ans. L'intervention d'ADA a annulé le mariage et l'a maintenue à l'école. Elle rêve toujours de devenir infirmière.",
    bodyFr: post16BodyFr,
  }).commit();
  console.log('✓ post-16 done');

  console.log('Patching post-8 (hospital-visits-bringing-hope)...');
  await client.patch('post-8').set({
    titleFr: "Jean-Baptiste : Le Patient que Personne ne Visitait",
    excerptFr: "Jean-Baptiste, 67 ans, était seul à l'hôpital après une opération. Sans famille pour lui apporter de la nourriture, il ne mangeait pas. L'équipe ADA l'a trouvé et a changé sa guérison.",
    bodyFr: post8BodyFr,
  }).commit();
  console.log('✓ post-8 done');

  console.log('All translations applied.');
}

main().catch((err) => { console.error(err); process.exit(1); });
