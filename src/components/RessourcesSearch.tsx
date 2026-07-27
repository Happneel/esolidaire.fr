"use client";

import { useMemo, useState } from "react";
import { searchFiches } from "@/lib/ressources";

export default function RessourcesSearch() {
  const [query, setQuery] = useState("");
  const categories = useMemo(() => searchFiches(query), [query]);

  return (
    <div>
      <label htmlFor="ressources-search" className="mb-1 block text-base font-medium text-slate-900">
        Rechercher dans les ressources
      </label>
      <input
        id="ressources-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex : assurance, CAF, animal perdu…"
        className="min-h-11 w-full rounded-md border-2 border-slate-400 px-3 py-2 text-base text-slate-900 focus:border-teal-700"
      />

      <div className="mt-6 space-y-8">
        {categories.length === 0 && (
          <p className="text-slate-600">Aucune fiche ne correspond à votre recherche.</p>
        )}
        {categories.map((cat) => (
          <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
            <h2 id={`cat-${cat.slug}`} className="text-xl font-bold text-slate-900">
              {cat.titre}
            </h2>
            <div className="mt-3 space-y-4">
              {cat.fiches.map((fiche) => (
                <details
                  key={fiche.slug}
                  className="rounded-lg border-2 border-slate-200 bg-white p-4 open:pb-4"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                    {fiche.titre}
                  </summary>
                  <p className="mt-2 text-slate-700">{fiche.resume}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-800">
                    {fiche.contenu.map((paragraphe, i) => (
                      <li key={i}>{paragraphe}</li>
                    ))}
                  </ul>
                  {fiche.liens && fiche.liens.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {fiche.liens.map((lien) => (
                        <li key={lien.url}>
                          <a
                            href={lien.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center font-medium text-teal-800 underline decoration-2 underline-offset-2"
                          >
                            {lien.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
