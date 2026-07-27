/**
 * Intégration avec l'API ouverte Vigicrues (aucune clé requise).
 *
 * Choix important : le flux GeoJSON expose bien un niveau de vigilance
 * (`NivInfViCr`) par tronçon, mais ses champs de date associés
 * (`dhcentcru`/`dhmentcru`) sont figés depuis 2020 dans nos tests — rien ne
 * garantit que ce niveau soit rafraîchi en temps réel dans ce flux. Sur un
 * sujet aussi sensible qu'une alerte crue, on préfère ne jamais afficher une
 * couleur qu'on ne peut pas garantir fraîche.
 *
 * On utilise donc ce flux uniquement pour sa géométrie (position réelle des
 * tronçons surveillés), qui elle est purement factuelle : on calcule le
 * tronçon le plus proche de la commune et on renvoie l'utilisateur vers la
 * carte officielle Vigicrues pour le niveau de vigilance en temps réel.
 */

const GEOJSON_URL = "https://www.vigicrues.gouv.fr/services/1/InfoVigiCru.geojson";
const SEUIL_DISTANCE_KM = 30;
// Fichier volumineux (~3 Mo, au-delà de la limite de 2 Mo du cache fetch de
// Next.js — un avertissement "Failed to set Next.js data cache" est attendu
// et sans conséquence). On ne s'en sert que pour de la géométrie qui varie
// très rarement : un revalidate long limite les téléchargements répétés.
const REVALIDATE_SECONDS = 6 * 3600;

type TronconFeature = {
  properties: { lbentcru?: string };
  geometry: { type: string; coordinates: number[][][] };
};

type GeoJsonTroncons = { features: TronconFeature[] };

export type TronconProche = {
  nom: string;
  distanceKm: number;
};

function distancePointSegment(
  p: [number, number],
  a: [number, number],
  b: [number, number],
): number {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

/** Projection plane locale (équirectangulaire) valable à l'échelle régionale. */
function versXY(lat: number, lon: number, latRef: number): [number, number] {
  const R = 6371;
  const x = ((lon * Math.PI) / 180) * Math.cos((latRef * Math.PI) / 180) * R;
  const y = ((lat * Math.PI) / 180) * R;
  return [x, y];
}

export async function getTronconVigicruesProche(
  lat: number,
  lon: number,
): Promise<TronconProche | null> {
  let data: GeoJsonTroncons;
  try {
    const res = await fetch(GEOJSON_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "MonEspaceSolidaire/1.0 (+https://esolidaire.fr)" },
    });
    if (!res.ok) return null;
    data = await res.json();
  } catch {
    return null;
  }

  const point = versXY(lat, lon, lat);
  let meilleur: { nom: string; distance: number } | null = null;

  for (const feature of data.features ?? []) {
    const nom = feature.properties?.lbentcru;
    if (!nom || feature.geometry?.type !== "MultiLineString") continue;

    for (const ligne of feature.geometry.coordinates) {
      for (let i = 0; i < ligne.length - 1; i++) {
        const a = versXY(ligne[i][1], ligne[i][0], lat);
        const b = versXY(ligne[i + 1][1], ligne[i + 1][0], lat);
        const distance = distancePointSegment(point, a, b);
        if (!meilleur || distance < meilleur.distance) {
          meilleur = { nom, distance };
        }
      }
    }
  }

  if (!meilleur || meilleur.distance > SEUIL_DISTANCE_KM) return null;
  return { nom: meilleur.nom, distanceKm: Math.round(meilleur.distance * 10) / 10 };
}
