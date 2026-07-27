// Génère src/lib/departements.ts à partir de la liste officielle des
// départements (geo.api.gouv.fr) + des résultats de vérification manuelle
// des sites préfecture (prefectureUrl / actualitesUrl), collectés le
// 27 juillet 2026 avant blocage temporaire par la protection anti-bot du
// site partagé "IDE". Voir scripts/prefectures-progress.log pour le détail.
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("scripts/departements-raw.json", "utf-8"));

const DOMAIN_OVERRIDES = {
  "75": "prefecturedepolice.interieur.gouv.fr",
};

function slugify(nom) {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// Confirmé le 27/07/2026 : page /Actualites au bon format (cards > 0).
const ACTUALITES_OK = new Set([
  "02", "04", "05", "06", "08", "09", "10", "11", "12", "13", "16", "17",
  "18", "21", "22", "23", "24", "25", "26", "27", "31", "33", "34", "44",
  "45", "66", "69", "84",
]);

// Confirmé le 27/07/2026 : site préfecture accessible (HTTP 200), mais
// page /Actualites absente ou au format différent (pas de fil affiché).
const PREFECTURE_BASE_OK = new Set([
  "01", "03", "07", "14", "15", "19", "28", "29", "35", "38", "59", "67",
  "2A", "75",
]);

const departements = raw
  .map((d) => ({ code: d.code, nom: d.nom }))
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((d) => {
    const domain = DOMAIN_OVERRIDES[d.code] ?? `${slugify(d.nom)}.gouv.fr`;
    const confirmed = ACTUALITES_OK.has(d.code) || PREFECTURE_BASE_OK.has(d.code);
    if (!confirmed) return d;
    return {
      ...d,
      prefectureUrl: `https://www.${domain}/`,
      ...(ACTUALITES_OK.has(d.code)
        ? { actualitesUrl: `https://www.${domain}/Actualites` }
        : {}),
    };
  });

const nbPrefecture = departements.filter((d) => d.prefectureUrl).length;
const nbActualites = departements.filter((d) => d.actualitesUrl).length;

const body = departements
  .map((d) => {
    const lines = [`  { code: "${d.code}", nom: ${JSON.stringify(d.nom)}`];
    if (d.prefectureUrl) lines.push(`, prefectureUrl: "${d.prefectureUrl}"`);
    if (d.actualitesUrl) lines.push(`, actualitesUrl: "${d.actualitesUrl}"`);
    return lines.join("") + " },";
  })
  .join("\n");

const fileContent = `import type { DepartementInfo } from "./types";

/**
 * Date de dernière vérification manuelle des liens sources génériques du
 * module Situation (Météo-France Vigilance, Géorisques). MVP0 : pas d'API
 * institutionnelle pour ces deux-là, mise à jour manuelle.
 */
export const DERNIERE_VERIFICATION_LIENS = "27 juillet 2026";

/**
 * Les 101 départements français (source : geo.api.gouv.fr, référentiel
 * stable). \`prefectureUrl\` et \`actualitesUrl\` ne sont renseignées que
 * pour les départements dont le site a été vérifié manuellement
 * (test réel des URLs, pas un pattern deviné) : ${nbPrefecture}/101 ont un
 * lien préfecture confirmé, dont ${nbActualites} avec un fil d'actualités
 * exploitable. Les autres n'affichent que le renvoi générique vers
 * service-public.fr, en attendant une vérification (à faire lentement et
 * avec des délais généreux entre requêtes : voir scripts/verify-prefectures.mjs
 * et la mésaventure documentée dans le README).
 */
export const DEPARTEMENTS: DepartementInfo[] = [
${body}
];

export function findDepartementByCode(code: string): DepartementInfo | undefined {
  return DEPARTEMENTS.find((d) => d.code === code);
}
`;

writeFileSync("src/lib/departements.ts", fileContent, "utf-8");
console.log(`OK : ${departements.length} départements, ${nbPrefecture} avec prefectureUrl, ${nbActualites} avec actualitesUrl`);
