/**
 * Récupère les dernières actualités publiées sur le site d'une préfecture.
 *
 * Il n'existe pas de flux RSS/Atom exploitable sur ces sites (vérifié). En
 * revanche, plusieurs préfectures partagent la même plateforme
 * gouvernementale ("IDE") avec une page /Actualites au balisage stable :
 * vérifié manuellement sur 10 départements avant activation (voir
 * `actualitesUrl` dans src/lib/communes.ts). Seuls le titre, la date et le
 * lien sont extraits ; le contenu de l'article n'est jamais reproduit,
 * uniquement lié.
 *
 * Dégradation : toute erreur (réseau, changement de balisage) renvoie
 * `null` et l'appelant retombe sur le simple lien vers le site de la
 * préfecture déjà affiché par ailleurs.
 */

const REVALIDATE_SECONDS = 900;
const MAX_ITEMS = 5;

export type ActualitePrefecture = {
  titre: string;
  url: string;
  date: string;
};

function decoderEntitesHtml(texte: string): string {
  return texte
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&eacute;/gi, "é")
    .replace(/&egrave;/gi, "è")
    .replace(/&agrave;/gi, "à")
    .replace(/&ccedil;/gi, "ç")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getActualitesPrefecture(
  actualitesUrl: string,
): Promise<ActualitePrefecture[] | null> {
  let html: string;
  try {
    const res = await fetch(actualitesUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "MonEspaceSolidaire/1.0 (+https://esolidaire.fr)" },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const origine = new URL(actualitesUrl).origin;
  const re = /<a class="fr-card__link" href="([^"]+)">\s*([\s\S]*?)\s*<\/a>[\s\S]*?Publié le (\d{2}\/\d{2}\/\d{4})/g;

  const items: ActualitePrefecture[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) && items.length < MAX_ITEMS) {
    const [, href, titreBrut, date] = match;
    items.push({
      titre: decoderEntitesHtml(titreBrut),
      url: href.startsWith("http") ? href : `${origine}${href}`,
      date,
    });
  }

  return items.length > 0 ? items : null;
}
