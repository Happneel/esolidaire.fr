import type { Commune } from "./types";

/**
 * Couverture de toutes les communes de France via l'API officielle
 * geo.api.gouv.fr (Etalab/IGN, ouverte, sans clé, CORS ouvert — vérifié).
 * Pas de liste statique à maintenir : recherche, géolocalisation et détail
 * par code INSEE passent tous par cette API.
 */

const API_BASE = "https://geo.api.gouv.fr";
const FIELDS = "nom,code,codeDepartement,centre,population";

type CommuneBrute = {
  nom: string;
  code: string;
  codeDepartement: string;
  centre?: { coordinates: [number, number] };
  population?: number;
};

function versCommune(brute: CommuneBrute): Commune {
  return {
    code: brute.code,
    nom: brute.nom,
    codeDepartement: brute.codeDepartement,
    lon: brute.centre?.coordinates[0] ?? 0,
    lat: brute.centre?.coordinates[1] ?? 0,
    population: brute.population,
  };
}

/** Recherche par nom, à utiliser côté client (CORS ouvert, pas de clé). */
export async function rechercherCommunes(query: string, limite = 8): Promise<Commune[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const res = await fetch(
      `${API_BASE}/communes?nom=${encodeURIComponent(q)}&fields=${FIELDS}&boost=population&limit=${limite}`,
    );
    if (!res.ok) return [];
    const data: CommuneBrute[] = await res.json();
    return data.map(versCommune);
  } catch {
    return [];
  }
}

/** Commune la plus proche d'un point GPS (calcul fait par l'API elle-même). */
export async function communeLaPlusProche(lat: number, lon: number): Promise<Commune | null> {
  try {
    const res = await fetch(`${API_BASE}/communes?lat=${lat}&lon=${lon}&fields=${FIELDS}&limit=1`);
    if (!res.ok) return null;
    const data: CommuneBrute[] = await res.json();
    return data[0] ? versCommune(data[0]) : null;
  } catch {
    return null;
  }
}

/** Détail d'une commune par son code INSEE, pour la page /commune/[code]. */
export async function communeParCode(code: string): Promise<Commune | null> {
  try {
    const res = await fetch(`${API_BASE}/communes/${encodeURIComponent(code)}?fields=${FIELDS}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return versCommune(await res.json());
  } catch {
    return null;
  }
}
