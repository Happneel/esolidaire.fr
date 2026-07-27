/**
 * Résout le lien vers la mairie d'une commune sur l'annuaire officiel de
 * l'administration (lannuaire.service-public.gouv.fr), sans clé ni compte.
 *
 * La page de résultats de recherche contient déjà, en HTML, le lien direct
 * vers la fiche de la mairie quand la recherche ne renvoie qu'un seul
 * résultat (vérifié en conditions réelles). On ne renvoie ce lien direct
 * que dans ce cas précis : en cas d'ambiguïté (plusieurs communes du même
 * nom, mairies annexes...) ou d'échec, on retombe sur la page de recherche
 * elle-même — jamais un premier résultat choisi au hasard, pour ne pas
 * risquer d'orienter quelqu'un vers la mauvaise mairie.
 */

const REVALIDATE_SECONDS = 3600;
const LIEN_RESULTAT = /<a\s+href="([^"]+)"[^>]*data-test="searchResult-link"[^>]*>/g;

export type ResultatMairie = {
  url: string;
  /** true si le lien pointe directement sur la fiche de la mairie, false si c'est une page de recherche. */
  direct: boolean;
};

export async function trouverMairie(nomCommune: string): Promise<ResultatMairie> {
  const rechercheUrl = `https://lannuaire.service-public.gouv.fr/recherche?whoWhat=Mairie&where=${encodeURIComponent(nomCommune)}`;

  try {
    const res = await fetch(rechercheUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "MonEspaceSolidaire/1.0 (+https://esolidaire.fr)" },
    });
    if (!res.ok) return { url: rechercheUrl, direct: false };

    const html = await res.text();
    const liens = [...html.matchAll(LIEN_RESULTAT)].map((m) => m[1]);

    if (liens.length === 1) return { url: liens[0], direct: true };
    return { url: rechercheUrl, direct: false };
  } catch {
    return { url: rechercheUrl, direct: false };
  }
}
