"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { rechercherCommunes } from "@/lib/communesApi";
import { findDepartementByCode } from "@/lib/departements";
import type { Commune } from "@/lib/types";
import type { ResultatMairie } from "@/lib/mairieAnnuaire";

const TYPES_DANGER = [
  "Incendie sans urgence vitale (départ de feu maîtrisé, fumée persistante…)",
  "Dégât matériel (arbre tombé, toiture endommagée, fuite…)",
  "Route ou accès bloqué",
  "Inondation ou montée des eaux",
  "Autre",
];

const DELAI_DEBOUNCE_MS = 300;
const LIEN_ANNUAIRE_GENERIQUE = "https://lannuaire.service-public.gouv.fr/";

export default function SignalerForm() {
  const [urgenceVitale, setUrgenceVitale] = useState<"oui" | "non" | null>(null);
  const [type, setType] = useState(TYPES_DANGER[0]);
  const [description, setDescription] = useState("");
  const [copie, setCopie] = useState(false);

  const [communeQuery, setCommuneQuery] = useState("");
  const [communeSelectionnee, setCommuneSelectionnee] = useState<Commune | null>(null);
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [mairieInfo, setMairieInfo] = useState<ResultatMairie | null>(null);
  const [mairieChargement, setMairieChargement] = useState(false);

  const listId = useId();
  const requeteCommune = useRef(0);
  const requeteMairie = useRef(0);

  const communeQueryValide = communeQuery.trim().length >= 2;

  useEffect(() => {
    if (!communeQueryValide) return;
    const q = communeQuery.trim();
    const idRequete = ++requeteCommune.current;
    const minuteur = setTimeout(() => {
      setRechercheEnCours(true);
      rechercherCommunes(q).then((communes) => {
        if (requeteCommune.current === idRequete) {
          setSuggestions(communes);
          setRechercheEnCours(false);
        }
      });
    }, DELAI_DEBOUNCE_MS);
    return () => clearTimeout(minuteur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communeQuery]);

  const suggestionsAffichees = communeQueryValide && !communeSelectionnee ? suggestions : [];

  function selectionnerCommune(commune: Commune) {
    setCommuneSelectionnee(commune);
    setCommuneQuery(commune.nom);
    setSuggestions([]);
    setMairieInfo(null);
    setMairieChargement(true);
    const idRequete = ++requeteMairie.current;
    fetch(`/api/mairie?commune=${encodeURIComponent(commune.nom)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resultat: ResultatMairie | null) => {
        if (requeteMairie.current === idRequete) {
          setMairieInfo(resultat);
          setMairieChargement(false);
        }
      })
      .catch(() => {
        if (requeteMairie.current === idRequete) setMairieChargement(false);
      });
  }

  function modifierCommuneQuery(valeur: string) {
    setCommuneQuery(valeur);
    if (communeSelectionnee) {
      setCommuneSelectionnee(null);
      setMairieInfo(null);
    }
  }

  const texteRecap = useMemo(() => {
    const lignes = [
      `Type de signalement : ${type}`,
      communeQuery.trim() ? `Commune : ${communeQuery.trim()}` : "Commune : non précisée",
      description ? `Description : ${description}` : null,
    ].filter(Boolean);
    return lignes.join("\n");
  }, [type, communeQuery, description]);

  async function copierTexte() {
    try {
      await navigator.clipboard.writeText(texteRecap);
      setCopie(true);
      setTimeout(() => setCopie(false), 3000);
    } catch {
      // Le presse-papiers n'est pas accessible : l'utilisateur peut copier le texte manuellement.
    }
  }

  if (urgenceVitale === null) {
    return (
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-slate-900">
          Une vie est-elle en danger, ou avez-vous un doute ?
        </legend>
        <button
          type="button"
          onClick={() => setUrgenceVitale("oui")}
          className="block min-h-11 w-full rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 text-left text-base font-semibold text-red-900 hover:bg-red-100"
        >
          Oui, ou je ne suis pas sûr(e)
        </button>
        <button
          type="button"
          onClick={() => setUrgenceVitale("non")}
          className="block min-h-11 w-full rounded-md border-2 border-slate-400 px-4 py-3 text-left text-base font-medium text-slate-900 hover:bg-slate-100"
        >
          Non, ce n&apos;est pas une urgence vitale
        </button>
      </fieldset>
    );
  }

  if (urgenceVitale === "oui") {
    return (
      <div className="rounded-lg border-2 border-red-700 bg-red-50 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-red-900">
          Appelez immédiatement
        </h2>
        <ul className="mt-3 space-y-2 text-lg">
          <li>
            <a href="tel:18" className="font-bold text-red-900 underline">18 — Pompiers</a>
          </li>
          <li>
            <a href="tel:15" className="font-bold text-red-900 underline">15 — SAMU</a>
          </li>
          <li>
            <a href="tel:17" className="font-bold text-red-900 underline">17 — Police / Gendarmerie</a>
          </li>
          <li>
            <a href="tel:112" className="font-bold text-red-900 underline">112 — Urgence européenne</a>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setUrgenceVitale(null)}
          className="mt-4 min-h-11 rounded-md border-2 border-red-700 px-4 py-2 text-red-900 hover:bg-red-100"
        >
          ← Revenir en arrière
        </button>
      </div>
    );
  }

  const lienMairie = mairieInfo?.url ?? LIEN_ANNUAIRE_GENERIQUE;
  const libelleLienMairie = mairieChargement
    ? "Recherche de la mairie…"
    : mairieInfo?.direct
      ? `Voir la mairie de ${communeSelectionnee?.nom} sur l'annuaire officiel`
      : communeSelectionnee
        ? `Chercher la mairie de ${communeSelectionnee.nom} sur l'annuaire officiel`
        : "Trouver le contact de ma mairie";

  return (
    <div className="space-y-5">
      <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
        Ce formulaire ne transmet et ne conserve aucune donnée sur ce site.
        Il vous aide simplement à préparer votre message avant d&apos;appeler
        ou d&apos;écrire au bon service.
      </p>

      <div>
        <label htmlFor="type-danger" className="mb-1 block text-base font-medium text-slate-900">
          Quel type de signalement ?
        </label>
        <select
          id="type-danger"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="min-h-11 w-full rounded-md border-2 border-slate-400 px-3 py-2 text-base text-slate-900 focus:border-teal-700"
        >
          {TYPES_DANGER.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="commune-signalement" className="mb-1 block text-base font-medium text-slate-900">
          Commune concernée (facultatif)
        </label>
        <input
          id="commune-signalement"
          type="text"
          role="combobox"
          aria-expanded={suggestionsAffichees.length > 0}
          aria-controls={listId}
          autoComplete="off"
          value={communeQuery}
          onChange={(e) => modifierCommuneQuery(e.target.value)}
          placeholder="Nom de la commune"
          className="min-h-11 w-full rounded-md border-2 border-slate-400 px-3 py-2 text-base text-slate-900 focus:border-teal-700"
        />
        {rechercheEnCours && <p className="mt-2 text-sm text-slate-600">Recherche…</p>}
        {suggestionsAffichees.length > 0 && (
          <ul id={listId} className="mt-2 divide-y divide-slate-200 rounded-md border border-slate-300">
            {suggestionsAffichees.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => selectionnerCommune(c)}
                  className="flex min-h-11 w-full items-center px-3 py-2 text-left text-base text-slate-900 hover:bg-slate-100"
                >
                  {c.nom}{" "}
                  <span className="ml-2 text-sm text-slate-600">
                    ({findDepartementByCode(c.codeDepartement)?.nom ?? c.codeDepartement})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="description-signalement" className="mb-1 block text-base font-medium text-slate-900">
          Description courte (facultatif)
        </label>
        <p className="mb-1 text-sm text-slate-600">
          Ne décrivez pas d&apos;information médicale ou personnelle : ce
          champ n&apos;est pas destiné à un suivi de santé.
        </p>
        <textarea
          id="description-signalement"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={280}
          className="w-full rounded-md border-2 border-slate-400 px-3 py-2 text-base text-slate-900 focus:border-teal-700"
        />
      </div>

      <div className="rounded-lg border-2 border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">
          Votre message prêt à transmettre
        </h2>
        <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-slate-50 p-3 text-sm text-slate-800">
          {texteRecap}
        </pre>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copierTexte}
            className="min-h-11 rounded-md bg-teal-700 px-4 py-2 text-base font-medium text-white hover:bg-teal-800"
          >
            {copie ? "Texte copié ✓" : "Copier le texte"}
          </button>
          <a
            href={lienMairie}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={mairieChargement}
            className="inline-flex min-h-11 items-center rounded-md border-2 border-teal-700 px-4 py-2 text-base font-medium text-teal-800 hover:bg-teal-50"
          >
            {libelleLienMairie}
          </a>
        </div>
        {communeSelectionnee && mairieInfo && !mairieInfo.direct && (
          <p className="mt-2 text-sm text-slate-600">
            Plusieurs résultats existent pour cette commune (ex. mairies
            annexes) : vous arriverez sur la page de recherche pour choisir
            la bonne.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setUrgenceVitale(null)}
        className="min-h-11 text-slate-700 underline"
      >
        ← Revenir en arrière
      </button>
    </div>
  );
}
