/** Une commune telle que renvoyée par l'API officielle geo.api.gouv.fr. */
export type Commune = {
  code: string; // Code INSEE, identifiant stable et unique.
  nom: string;
  codeDepartement: string;
  lat: number;
  lon: number;
  population?: number;
};

export type DepartementInfo = {
  code: string;
  nom: string;
  /** URL du site de la préfecture. Renseignée uniquement après vérification manuelle réelle (voir src/lib/departements.ts). */
  prefectureUrl?: string;
  /**
   * URL de la page "Actualités" de la préfecture, uniquement quand son
   * balisage a été vérifié manuellement comme compatible avec notre lecteur
   * (voir src/lib/prefectureActualites.ts). Absent = pas de fil affiché,
   * uniquement le lien vers le site de la préfecture.
   */
  actualitesUrl?: string;
};

export type LienSource = {
  label: string;
  url: string;
};

export type Fiche = {
  slug: string;
  titre: string;
  resume: string;
  contenu: string[];
  liens?: LienSource[];
};

export type CategorieRessources = {
  slug: string;
  titre: string;
  fiches: Fiche[];
};
