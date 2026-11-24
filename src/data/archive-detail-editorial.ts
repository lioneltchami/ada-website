type ArchiveEditorial = {
  lead: string;
  sections: { title: string; text: string }[];
  financialLabels: [string, string, string];
  financialBasis: string;
};

// English is the source; French is its translation. This pilot uses the released
// project report, not draft allocations or earlier cleanup records.
export const archiveResolvedFinance: Record<string, { received: number; itemSubtotal: number; fees: number }> = {
  "city-cleanup-may-2023": { received: 100000, itemSubtotal: 94400, fees: 1500 },
};
export const archiveEditorial: Record<string, Record<"en" | "fr", ArchiveEditorial>> = {
  "city-cleanup-may-2023": {
    en: {
      lead: "On Labour Day, our team and volunteers cleared litter from shared spaces in Buea. It was a practical way to care for our neighbors and give back through our time and effort.",
      sections: [
        { title: "Why we did it", text: "Taking care of shared spaces is part of taking care of the people who use them. For our team, serving Buea this way was a practical expression of our Christian faith. Participation did not depend on joining prayer or worship." },
        { title: "How we did the work", text: "We used buckets, a rake and a spade to gather litter, with masks and gloves for protection. The project record also lists transport, caps, T-shirts and lettering for the buckets." },
        { title: "What we can report", text: "We carried out the cleanup in Buea. The project record does not give a participant count, the amount of litter collected, or a measured effect on public health." },
      ],
      financialLabels: ["Funding received", "Recorded expenses", "Balance after the project"],
      financialBasis: "Recorded expenses include 1,500 FCFA in fees. The balance is for this project at the time, not the current balance of our account. The figures are from our project record, not an independent audit.",
    },
    fr: {
      lead: "À l’occasion de la fête du Travail, notre équipe et des bénévoles ont ramassé des déchets dans des espaces communs à Buea. C’était une façon concrète de prendre soin de nos voisins en donnant de notre temps et de notre énergie.",
      sections: [
        { title: "Pourquoi nous avons agi", text: "Prendre soin des espaces communs, c’est aussi prendre soin des personnes qui les utilisent. Pour notre équipe, servir Buea de cette manière était une expression concrète de notre foi chrétienne. Il n’était pas nécessaire de prendre part à la prière ou à la louange pour participer au nettoyage." },
        { title: "Comment nous avons procédé", text: "Nous avons ramassé les déchets à l’aide de seaux, d’un râteau et d’une bêche, avec des masques et des gants pour nous protéger. Le relevé du projet mentionne aussi le transport, les casquettes, les tee-shirts et le marquage des seaux." },
        { title: "Ce que nous pouvons rapporter", text: "Nous avons mené le nettoyage à Buea. Le relevé du projet ne précise ni le nombre de participants, ni la quantité de déchets collectés, ni d’effet mesuré sur la santé publique." },
      ],
      financialLabels: ["Financement reçu", "Dépenses enregistrées", "Solde après le projet"],
      financialBasis: "Les dépenses enregistrées comprennent 1 500 FCFA de frais. Le solde est celui du projet à l’époque, pas le solde actuel de notre compte. Les chiffres proviennent de notre relevé du projet, et non d’un audit indépendant.",
    },
  },
};
