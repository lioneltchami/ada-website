import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const configPath = join(homedir(), '.config', 'sanity', 'config.json');
const cliToken = JSON.parse(readFileSync(configPath, 'utf-8')).authToken;

const client = createClient({
  projectId: 'rj2m21gk',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_TOKEN || cliToken,
  useCdn: false,
});

function block(style: string, text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  };
}

async function main() {
  // POST 1: Carine
  await client.patch('post-14').set({
    titleFr: 'Carine : De Diplômée ADA à Mentor Bénévole',
    excerptFr: 'Carine Fotso avait 21 ans, sans formation et vivant chez sa tante. Après le programme ADA, elle gère son propre salon et consacre 4 heures par semaine au mentorat des nouvelles apprenantes.',
    bodyFr: [
      block('h3', 'Où Carine Était Avant', 'c1'),
      block('normal', 'Carine Fotso avait 21 ans et vivait chez sa tante à Douala. Elle avait terminé le secondaire mais sa famille n\'avait pas les moyens de payer l\'université. Pour gagner un peu d\'argent, elle vendait du crédit téléphonique dans la rue, gagnant à peine 2 000 CFA par jour. Sa tante lui avait lancé un ultimatum : trouver un vrai travail ou quitter la maison avant la fin de l\'année.', 'c2'),
      block('h3', 'Comment Nous Avons Rencontré Carine', 'c3'),
      block('normal', 'Carine a vu un flyer ADA à l\'église un dimanche. Elle a assisté à la journée portes ouvertes en février 2023, où elle a vu du vrai matériel de coiffure et rencontré d\'anciennes diplômées qui géraient leurs propres salons. Pour la première fois, elle a vu un chemin concret vers l\'indépendance.', 'c4'),
      block('h3', 'Ce Que Nous Avons Fait', 'c5'),
      block('normal', 'Carine a été inscrite dans notre programme de coiffure de 6 mois. La formation couvrait le tressage, le tissage, le défrisage et la coloration. Elle a eu accès à du matériel professionnel, a reçu une allocation mensuelle de 15 000 CFA pour le transport et les repas, et a suivi un module de gestion d\'entreprise. À la fin du programme, elle a reçu un kit de démarrage complet avec les outils essentiels.', 'c6'),
      block('h3', 'Comment Cela L\'a Aidée', 'c7'),
      block('normal', 'Carine a excellé dans la formation. Sa créativité naturelle s\'est révélée dans les styles complexes de tressage et de coloration. Mais ce sont les compétences en gestion qui ont été les plus transformatrices : elle a appris à fixer ses prix, à épargner régulièrement et à utiliser le marketing WhatsApp pour attirer des clientes. Ces compétences pratiques ont fait la différence entre savoir coiffer et pouvoir en vivre.', 'c8'),
      block('h3', 'Où Carine Est Maintenant', 'c9'),
      block('normal', 'Carine a obtenu son diplôme en août 2023. Elle a loué un petit espace et ouvert son propre salon. Elle gagne entre 90 000 et 130 000 CFA par mois, a son propre appartement et épargne 20 % de ses revenus chaque mois. Elle consacre bénévolement 4 heures par semaine au mentorat des nouvelles apprenantes du programme ADA, les aidant à développer leur confiance et leurs compétences techniques.', 'c10'),
    ],
  }).commit();
  console.log('✓ post-14 (Carine) French translation added');

  // POST 2: Grace
  await client.patch('post-6').set({
    titleFr: "L'Histoire de Grace : De Mère Abandonnée à Formatrice",
    excerptFr: "Le mari de Grace est parti sans prévenir, la laissant avec deux enfants et rien. Aujourd'hui, elle dirige un atelier de couture et forme bénévolement 5 nouvelles femmes par cycle.",
    bodyFr: [
      block('h3', 'Où Grace Était Avant', 'g1'),
      block('normal', "Grace avait 28 ans quand son mari est parti sans prévenir en janvier 2023. Il a emporté toutes leurs économies, la laissant seule avec 2 enfants de 3 et 5 ans. Elle n'avait aucune formation professionnelle. Désespérée, elle a vendu ses meubles un par un pour nourrir ses enfants. Elle a même envisagé de placer ses enfants dans un orphelinat.", 'g2'),
      block('h3', 'Comment Nous Avons Rencontré Grace', 'g3'),
      block('normal', "Une voisine a parlé d'ADA à Grace. Elle a marché 45 minutes pour venir nous voir. Elle était visiblement sous-alimentée. Nous lui avons immédiatement fourni de la nourriture et l'avons inscrite sur la liste d'attente pour notre prochain cycle de formation.", 'g4'),
      block('h3', 'Ce Que Nous Avons Fait', 'g5'),
      block('normal', "Notre approche pour Grace a été double. Pendant les mois 1 et 2, nous avons fourni une aide d'urgence : nourriture, vêtements et aide au loyer pour stabiliser sa famille. Ensuite, des mois 3 à 8, elle a suivi notre formation de couture de 6 mois. Le coût total du programme pour Grace était de 350 $.", 'g6'),
      block('h3', "Comment Cela L'a Aidée", 'g7'),
      block('normal', "Grace avait un talent naturel pour la couture. Elle était l'apprenante la plus rapide de son groupe. Dès le mois 4, elle prenait déjà des commandes de clientes. Le soutien alimentaire pendant la formation a été crucial : sans lui, elle n'aurait pas pu se concentrer sur l'apprentissage.", 'g8'),
      block('h3', 'Où Grace Est Maintenant', 'g9'),
      block('normal', "Grace dirige son propre atelier de couture. Elle gagne entre 100 000 et 150 000 CFA par mois, emploie une apprentie, et ses 2 enfants sont scolarisés. Elle épargne régulièrement et se porte bénévole comme formatrice, encadrant 5 nouvelles femmes par cycle dans le programme ADA.", 'g10'),
    ],
  }).commit();
  console.log('✓ post-6 (Grace) French translation added');

  console.log('\n✅ Both translations complete!');
}

main().catch((err) => { console.error('Failed:', err.message); process.exit(1); });
