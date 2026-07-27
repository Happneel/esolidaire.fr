"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { rechercherCommunes, communeLaPlusProche } from "@/lib/communesApi";
import { findDepartementByCode } from "@/lib/departements";
import type { Commune } from "@/lib/types";

const DELAI_DEBOUNCE_MS = 300;

export default function CommuneSelector() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Commune[]>([]);
  const [recherche, setRecherche] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const router = useRouter();
  const listId = useId();
  const requeteEnCours = useRef(0);

  const requeteValide = query.trim().length >= 2;

  useEffect(() => {
    if (!requeteValide) return;
    const q = query.trim();
    const idRequete = ++requeteEnCours.current;
    const minuteur = setTimeout(() => {
      setRecherche(true);
      rechercherCommunes(q).then((communes) => {
        if (requeteEnCours.current === idRequete) {
          setResults(communes);
          setRecherche(false);
        }
      });
    }, DELAI_DEBOUNCE_MS);
    return () => clearTimeout(minuteur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const resultatsAffiches = requeteValide ? results : [];

  function handleLocate() {
    if (!("geolocation" in navigator)) {
      setGeoError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const commune = await communeLaPlusProche(
          position.coords.latitude,
          position.coords.longitude,
        );
        setLocating(false);
        if (commune) {
          router.push(`/commune/${commune.code}`);
        } else {
          setGeoError("Impossible de déterminer votre commune. Cherchez-la ci-dessous.");
        }
      },
      () => {
        setLocating(false);
        setGeoError(
          "Impossible d'utiliser votre position. Cherchez plutôt votre commune ci-dessous.",
        );
      },
      { timeout: 10000 },
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="commune-search" className="mb-1 block text-base font-medium text-slate-900">
          Cherchez votre commune
        </label>
        <input
          id="commune-search"
          type="text"
          role="combobox"
          aria-expanded={resultatsAffiches.length > 0}
          aria-controls={listId}
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom de la commune"
          className="min-h-11 w-full rounded-md border-2 border-slate-400 px-3 py-2 text-base text-slate-900 focus:border-teal-700"
        />
        {recherche && <p className="mt-2 text-sm text-slate-600">Recherche…</p>}
        {resultatsAffiches.length > 0 && (
          <ul id={listId} className="mt-2 divide-y divide-slate-200 rounded-md border border-slate-300">
            {resultatsAffiches.map((c) => (
              <li key={c.code}>
                <Link
                  href={`/commune/${c.code}`}
                  className="flex min-h-11 items-center px-3 py-2 text-base text-slate-900 hover:bg-slate-100"
                >
                  {c.nom}{" "}
                  <span className="ml-2 text-sm text-slate-600">
                    ({findDepartementByCode(c.codeDepartement)?.nom ?? c.codeDepartement})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!recherche && requeteValide && resultatsAffiches.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">
            Aucune commune trouvée pour « {query} ».
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">ou</span>
      </div>

      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        className="inline-flex min-h-11 items-center rounded-md border-2 border-teal-700 px-4 py-2 text-base font-medium text-teal-800 hover:bg-teal-50 disabled:opacity-60"
      >
        {locating ? "Localisation en cours…" : "Utiliser ma position"}
      </button>
      {geoError && (
        <p role="alert" className="text-sm text-red-700">
          {geoError}
        </p>
      )}
    </div>
  );
}
