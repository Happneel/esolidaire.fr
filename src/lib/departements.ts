import type { DepartementInfo } from "./types";

/**
 * Date de dernière vérification manuelle des liens sources génériques du
 * module Situation (Météo-France Vigilance, Géorisques). MVP0 : pas d'API
 * institutionnelle pour ces deux-là, mise à jour manuelle.
 */
export const DERNIERE_VERIFICATION_LIENS = "27 juillet 2026";

/**
 * Les 101 départements français (source : geo.api.gouv.fr, référentiel
 * stable). `prefectureUrl` et `actualitesUrl` ne sont renseignées que
 * pour les départements dont le site a été vérifié manuellement
 * (test réel des URLs, pas un pattern deviné) : 42/101 ont un
 * lien préfecture confirmé, dont 28 avec un fil d'actualités
 * exploitable. Les autres n'affichent que le renvoi générique vers
 * service-public.fr, en attendant une vérification (à faire lentement et
 * avec des délais généreux entre requêtes : voir scripts/verify-prefectures.mjs
 * et la mésaventure documentée dans le README).
 */
export const DEPARTEMENTS: DepartementInfo[] = [
  { code: "01", nom: "Ain", prefectureUrl: "https://www.ain.gouv.fr/" },
  { code: "02", nom: "Aisne", prefectureUrl: "https://www.aisne.gouv.fr/", actualitesUrl: "https://www.aisne.gouv.fr/Actualites" },
  { code: "03", nom: "Allier", prefectureUrl: "https://www.allier.gouv.fr/" },
  { code: "04", nom: "Alpes-de-Haute-Provence", prefectureUrl: "https://www.alpes-de-haute-provence.gouv.fr/", actualitesUrl: "https://www.alpes-de-haute-provence.gouv.fr/Actualites" },
  { code: "05", nom: "Hautes-Alpes", prefectureUrl: "https://www.hautes-alpes.gouv.fr/", actualitesUrl: "https://www.hautes-alpes.gouv.fr/Actualites" },
  { code: "06", nom: "Alpes-Maritimes", prefectureUrl: "https://www.alpes-maritimes.gouv.fr/", actualitesUrl: "https://www.alpes-maritimes.gouv.fr/Actualites" },
  { code: "07", nom: "Ardèche", prefectureUrl: "https://www.ardeche.gouv.fr/" },
  { code: "08", nom: "Ardennes", prefectureUrl: "https://www.ardennes.gouv.fr/", actualitesUrl: "https://www.ardennes.gouv.fr/Actualites" },
  { code: "09", nom: "Ariège", prefectureUrl: "https://www.ariege.gouv.fr/", actualitesUrl: "https://www.ariege.gouv.fr/Actualites" },
  { code: "10", nom: "Aube", prefectureUrl: "https://www.aube.gouv.fr/", actualitesUrl: "https://www.aube.gouv.fr/Actualites" },
  { code: "11", nom: "Aude", prefectureUrl: "https://www.aude.gouv.fr/", actualitesUrl: "https://www.aude.gouv.fr/Actualites" },
  { code: "12", nom: "Aveyron", prefectureUrl: "https://www.aveyron.gouv.fr/", actualitesUrl: "https://www.aveyron.gouv.fr/Actualites" },
  { code: "13", nom: "Bouches-du-Rhône", prefectureUrl: "https://www.bouches-du-rhone.gouv.fr/", actualitesUrl: "https://www.bouches-du-rhone.gouv.fr/Actualites" },
  { code: "14", nom: "Calvados", prefectureUrl: "https://www.calvados.gouv.fr/" },
  { code: "15", nom: "Cantal", prefectureUrl: "https://www.cantal.gouv.fr/" },
  { code: "16", nom: "Charente", prefectureUrl: "https://www.charente.gouv.fr/", actualitesUrl: "https://www.charente.gouv.fr/Actualites" },
  { code: "17", nom: "Charente-Maritime", prefectureUrl: "https://www.charente-maritime.gouv.fr/", actualitesUrl: "https://www.charente-maritime.gouv.fr/Actualites" },
  { code: "18", nom: "Cher", prefectureUrl: "https://www.cher.gouv.fr/", actualitesUrl: "https://www.cher.gouv.fr/Actualites" },
  { code: "19", nom: "Corrèze", prefectureUrl: "https://www.correze.gouv.fr/" },
  { code: "21", nom: "Côte-d'Or", prefectureUrl: "https://www.cote-dor.gouv.fr/", actualitesUrl: "https://www.cote-dor.gouv.fr/Actualites" },
  { code: "22", nom: "Côtes-d'Armor", prefectureUrl: "https://www.cotes-darmor.gouv.fr/", actualitesUrl: "https://www.cotes-darmor.gouv.fr/Actualites" },
  { code: "23", nom: "Creuse", prefectureUrl: "https://www.creuse.gouv.fr/", actualitesUrl: "https://www.creuse.gouv.fr/Actualites" },
  { code: "24", nom: "Dordogne", prefectureUrl: "https://www.dordogne.gouv.fr/", actualitesUrl: "https://www.dordogne.gouv.fr/Actualites" },
  { code: "25", nom: "Doubs", prefectureUrl: "https://www.doubs.gouv.fr/", actualitesUrl: "https://www.doubs.gouv.fr/Actualites" },
  { code: "26", nom: "Drôme", prefectureUrl: "https://www.drome.gouv.fr/", actualitesUrl: "https://www.drome.gouv.fr/Actualites" },
  { code: "27", nom: "Eure", prefectureUrl: "https://www.eure.gouv.fr/", actualitesUrl: "https://www.eure.gouv.fr/Actualites" },
  { code: "28", nom: "Eure-et-Loir", prefectureUrl: "https://www.eure-et-loir.gouv.fr/" },
  { code: "29", nom: "Finistère", prefectureUrl: "https://www.finistere.gouv.fr/" },
  { code: "2A", nom: "Corse-du-Sud", prefectureUrl: "https://www.corse-du-sud.gouv.fr/" },
  { code: "2B", nom: "Haute-Corse" },
  { code: "30", nom: "Gard" },
  { code: "31", nom: "Haute-Garonne", prefectureUrl: "https://www.haute-garonne.gouv.fr/", actualitesUrl: "https://www.haute-garonne.gouv.fr/Actualites" },
  { code: "32", nom: "Gers" },
  { code: "33", nom: "Gironde", prefectureUrl: "https://www.gironde.gouv.fr/", actualitesUrl: "https://www.gironde.gouv.fr/Actualites" },
  { code: "34", nom: "Hérault", prefectureUrl: "https://www.herault.gouv.fr/", actualitesUrl: "https://www.herault.gouv.fr/Actualites" },
  { code: "35", nom: "Ille-et-Vilaine", prefectureUrl: "https://www.ille-et-vilaine.gouv.fr/" },
  { code: "36", nom: "Indre" },
  { code: "37", nom: "Indre-et-Loire" },
  { code: "38", nom: "Isère", prefectureUrl: "https://www.isere.gouv.fr/" },
  { code: "39", nom: "Jura" },
  { code: "40", nom: "Landes" },
  { code: "41", nom: "Loir-et-Cher" },
  { code: "42", nom: "Loire" },
  { code: "43", nom: "Haute-Loire" },
  { code: "44", nom: "Loire-Atlantique", prefectureUrl: "https://www.loire-atlantique.gouv.fr/", actualitesUrl: "https://www.loire-atlantique.gouv.fr/Actualites" },
  { code: "45", nom: "Loiret", prefectureUrl: "https://www.loiret.gouv.fr/", actualitesUrl: "https://www.loiret.gouv.fr/Actualites" },
  { code: "46", nom: "Lot" },
  { code: "47", nom: "Lot-et-Garonne" },
  { code: "48", nom: "Lozère" },
  { code: "49", nom: "Maine-et-Loire" },
  { code: "50", nom: "Manche" },
  { code: "51", nom: "Marne" },
  { code: "52", nom: "Haute-Marne" },
  { code: "53", nom: "Mayenne" },
  { code: "54", nom: "Meurthe-et-Moselle" },
  { code: "55", nom: "Meuse" },
  { code: "56", nom: "Morbihan" },
  { code: "57", nom: "Moselle" },
  { code: "58", nom: "Nièvre" },
  { code: "59", nom: "Nord", prefectureUrl: "https://www.nord.gouv.fr/" },
  { code: "60", nom: "Oise" },
  { code: "61", nom: "Orne" },
  { code: "62", nom: "Pas-de-Calais" },
  { code: "63", nom: "Puy-de-Dôme" },
  { code: "64", nom: "Pyrénées-Atlantiques" },
  { code: "65", nom: "Hautes-Pyrénées" },
  { code: "66", nom: "Pyrénées-Orientales", prefectureUrl: "https://www.pyrenees-orientales.gouv.fr/", actualitesUrl: "https://www.pyrenees-orientales.gouv.fr/Actualites" },
  { code: "67", nom: "Bas-Rhin", prefectureUrl: "https://www.bas-rhin.gouv.fr/" },
  { code: "68", nom: "Haut-Rhin" },
  { code: "69", nom: "Rhône", prefectureUrl: "https://www.rhone.gouv.fr/", actualitesUrl: "https://www.rhone.gouv.fr/Actualites" },
  { code: "70", nom: "Haute-Saône" },
  { code: "71", nom: "Saône-et-Loire" },
  { code: "72", nom: "Sarthe" },
  { code: "73", nom: "Savoie" },
  { code: "74", nom: "Haute-Savoie" },
  { code: "75", nom: "Paris", prefectureUrl: "https://www.prefecturedepolice.interieur.gouv.fr/" },
  { code: "76", nom: "Seine-Maritime" },
  { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" },
  { code: "79", nom: "Deux-Sèvres" },
  { code: "80", nom: "Somme" },
  { code: "81", nom: "Tarn" },
  { code: "82", nom: "Tarn-et-Garonne" },
  { code: "83", nom: "Var" },
  { code: "84", nom: "Vaucluse", prefectureUrl: "https://www.vaucluse.gouv.fr/", actualitesUrl: "https://www.vaucluse.gouv.fr/Actualites" },
  { code: "85", nom: "Vendée" },
  { code: "86", nom: "Vienne" },
  { code: "87", nom: "Haute-Vienne" },
  { code: "88", nom: "Vosges" },
  { code: "89", nom: "Yonne" },
  { code: "90", nom: "Territoire de Belfort" },
  { code: "91", nom: "Essonne" },
  { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" },
  { code: "94", nom: "Val-de-Marne" },
  { code: "95", nom: "Val-d'Oise" },
  { code: "971", nom: "Guadeloupe" },
  { code: "972", nom: "Martinique" },
  { code: "973", nom: "Guyane" },
  { code: "974", nom: "La Réunion" },
  { code: "976", nom: "Mayotte" },
];

export function findDepartementByCode(code: string): DepartementInfo | undefined {
  return DEPARTEMENTS.find((d) => d.code === code);
}
