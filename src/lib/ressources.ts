import type { CategorieRessources } from "./types";

export const CATEGORIES_RESSOURCES: CategorieRessources[] = [
  {
    slug: "urgence",
    titre: "En urgence",
    fiches: [
      {
        slug: "numeros-urgence",
        titre: "Les numéros d'urgence à connaître",
        resume: "Qui appeler selon la situation, disponible 24h/24.",
        contenu: [
          "15 — SAMU : urgence médicale, blessure grave, malaise.",
          "17 — Police / Gendarmerie : danger immédiat, sécurité des personnes.",
          "18 — Pompiers : incendie, accident, personne bloquée.",
          "112 — Numéro d'urgence européen, utilisable depuis un mobile même sans réseau de votre opérateur.",
          "114 — Numéro d'urgence par SMS pour les personnes sourdes, malentendantes, aphasiques ou dysphasiques.",
          "En cas de doute sur la gravité, appelez quand même. Les services sauront vous orienter.",
        ],
      },
      {
        slug: "premiers-reflexes",
        titre: "Premiers réflexes en cas de catastrophe",
        resume: "Se mettre en sécurité avant tout le reste.",
        contenu: [
          "Éloignez-vous de la zone de danger et suivez les consignes des autorités présentes sur place.",
          "Coupez le gaz et l'électricité si vous quittez votre logement en urgence, uniquement si cela ne vous met pas en danger.",
          "Emportez vos papiers d'identité, vos traitements médicaux en cours et votre téléphone si vous le pouvez.",
          "Prévenez un proche de l'endroit où vous vous trouvez, par SMS de préférence (réseau plus fiable qu'un appel en cas de saturation).",
          "Ne prenez pas votre véhicule dans une zone inondée, même sur une faible hauteur d'eau : 30 cm suffisent à emporter une voiture.",
        ],
      },
    ],
  },
  {
    slug: "contacts",
    titre: "Qui contacter",
    fiches: [
      {
        slug: "mairie",
        titre: "Trouver les coordonnées de votre mairie",
        resume: "Votre mairie est le premier point de contact local en cas de crise.",
        contenu: [
          "La mairie organise l'accueil d'urgence, les centres d'hébergement et relaie les consignes de la préfecture.",
          "Utilisez l'annuaire officiel de l'administration pour trouver les coordonnées exactes de votre mairie.",
        ],
        liens: [
          { label: "Annuaire officiel des mairies (service-public.fr)", url: "https://lannuaire.service-public.fr/" },
        ],
      },
      {
        slug: "france-services",
        titre: "France Services : un guichet unique pour vos démarches",
        resume: "Un seul lieu pour être accompagné dans toutes vos démarches administratives.",
        contenu: [
          "Les structures France Services aident gratuitement pour les démarches CAF, CPAM, retraite, impôts, permis de conduire, et plus.",
          "Utile en particulier si vous avez perdu vos documents ou l'accès à vos comptes en ligne.",
        ],
        liens: [{ label: "Trouver une structure France Services", url: "https://www.france-services.gouv.fr/" }],
      },
      {
        slug: "caf",
        titre: "CAF : aides d'urgence et allocations",
        resume: "La CAF peut débloquer une aide financière d'urgence dans certaines situations.",
        contenu: [
          "Signalez votre situation à la CAF si un sinistre affecte votre logement : des aides exceptionnelles existent selon les caisses.",
          "Vous pouvez déclarer un changement de situation directement en ligne.",
        ],
        liens: [{ label: "Site de la CAF", url: "https://www.caf.fr/" }],
      },
      {
        slug: "ameli",
        titre: "Assurance Maladie (Ameli) : soins et médicaments perdus",
        resume: "Continuité des soins même sans carte Vitale ni ordonnance.",
        contenu: [
          "En cas de perte de vos médicaments ou de votre carte Vitale, une pharmacie peut vous délivrer un traitement en urgence sur simple présentation d'une pièce d'identité.",
          "Votre pharmacien ou votre médecin traitant peut consulter votre historique de soins.",
        ],
        liens: [{ label: "Site de l'Assurance Maladie", url: "https://www.ameli.fr/" }],
      },
    ],
  },
  {
    slug: "assurance",
    titre: "Assurance et sinistre",
    fiches: [
      {
        slug: "declarer-sinistre",
        titre: "Comment déclarer un sinistre à votre assurance",
        resume: "Les délais et démarches à connaître, à confirmer avec votre assureur.",
        contenu: [
          "Contactez votre assureur le plus tôt possible : le délai habituel est de 5 jours ouvrés après le sinistre, souvent étendu à 10 jours ouvrés en cas de catastrophe naturelle reconnue par un arrêté officiel.",
          "Ces délais peuvent varier selon votre contrat : vérifiez toujours les conditions exactes auprès de votre assureur.",
          "Conservez tout ce qui peut servir de preuve (objets endommagés, tickets de caisse, factures) avant de jeter quoi que ce soit.",
          "Cette plateforme ne stocke aucune photo ni aucun document : utilisez l'application de votre assureur ou votre propre stockage (téléphone, cloud personnel) pour vos preuves.",
        ],
        liens: [
          { label: "Fiche officielle sur la déclaration de sinistre (service-public.fr)", url: "https://www.service-public.fr/particuliers/vosdroits/F13421" },
        ],
      },
      {
        slug: "photographier-degats",
        titre: "Comment photographier vos dégâts correctement",
        resume: "De bonnes photos accélèrent le traitement de votre dossier.",
        contenu: [
          "Prenez une photo d'ensemble de chaque pièce touchée, puis des photos rapprochées de chaque dégât.",
          "Incluez un objet du quotidien à côté pour donner une idée de l'échelle si c'est pertinent.",
          "Notez la date et gardez les photos dans l'ordre : la plupart des téléphones l'horodatent automatiquement.",
          "Ne supprimez rien avant le passage de l'expert d'assurance, même après avoir commencé à nettoyer.",
        ],
      },
      {
        slug: "droits-sinistre",
        titre: "Vos droits en tant que sinistré",
        resume: "Relogement, aides exceptionnelles, catastrophe naturelle reconnue.",
        contenu: [
          "Si votre logement est inhabitable, la mairie peut organiser un hébergement d'urgence en centre d'accueil.",
          "La garantie \"catastrophe naturelle\" ne s'applique que si un arrêté officiel reconnaît l'état de catastrophe naturelle pour votre commune : la mairie fait la demande, vous n'avez rien à faire pour ça.",
          "Des aides financières exceptionnelles existent parfois au niveau local ou national selon l'ampleur de l'événement : renseignez-vous auprès de votre mairie et de France Services.",
        ],
        liens: [
          { label: "Comprendre la garantie catastrophe naturelle (service-public.fr)", url: "https://www.service-public.fr/particuliers/vosdroits/F13421" },
        ],
      },
    ],
  },
  {
    slug: "solidarite",
    titre: "Bénévolat et solidarité",
    fiches: [
      {
        slug: "beneficier-benevolat",
        titre: "Trouver ou proposer de l'aide bénévole",
        resume: "La plateforme officielle de l'engagement bénévole en France.",
        contenu: [
          "JeVeuxAider.gouv.fr est la plateforme officielle pour proposer ou trouver des missions de bénévolat, y compris en réponse aux catastrophes.",
          "Nous redirigeons vers ce service plutôt que de recréer un système parallèle.",
        ],
        liens: [{ label: "JeVeuxAider.gouv.fr", url: "https://www.jeveuxaider.gouv.fr/" }],
      },
      {
        slug: "hebergement-solidaire",
        titre: "Proposer ou trouver un hébergement temporaire",
        resume: "Pour l'hébergement solidaire de particulier à particulier, en dehors des centres d'accueil officiels.",
        contenu: [
          "Airbnb Open Homes met en relation gratuitement des personnes déplacées par une catastrophe avec des hôtes solidaires.",
          "Pour un hébergement d'urgence organisé localement, contactez d'abord votre mairie qui gère les centres d'accueil officiels.",
        ],
        liens: [{ label: "Airbnb.org — Open Homes", url: "https://www.airbnb.org/" }],
      },
      {
        slug: "retrouver-un-proche",
        titre: "Retrouver un proche ou signaler être en sécurité",
        resume: "Le service officiel de rétablissement des liens familiaux.",
        contenu: [
          "La Croix-Rouge française propose un service de rétablissement des liens familiaux en cas de catastrophe, pour aider à retrouver un proche sans nouvelles.",
        ],
        liens: [{ label: "Croix-Rouge française", url: "https://www.croix-rouge.fr/" }],
      },
      {
        slug: "animaux-perdus",
        titre: "Animal perdu ou trouvé",
        resume: "Toujours passer par le fichier national d'identification.",
        contenu: [
          "I-CAD est le fichier national d'identification des carnivores domestiques : c'est la référence pour déclarer un animal perdu ou trouvé identifié par puce ou tatouage.",
          "Ne confiez ou ne récupérez jamais un animal directement auprès d'un inconnu sans passer par un refuge, une association ou I-CAD.",
        ],
        liens: [{ label: "I-CAD", url: "https://www.i-cad.fr/" }],
      },
    ],
  },
];

export function searchFiches(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return CATEGORIES_RESSOURCES;
  return CATEGORIES_RESSOURCES.map((cat) => ({
    ...cat,
    fiches: cat.fiches.filter(
      (f) =>
        f.titre.toLowerCase().includes(q) ||
        f.resume.toLowerCase().includes(q) ||
        f.contenu.some((p) => p.toLowerCase().includes(q)),
    ),
  })).filter((cat) => cat.fiches.length > 0);
}
