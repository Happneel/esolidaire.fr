import type { ActualitePrefecture } from "@/lib/prefectureActualites";

export default function FilActualitesPrefecture({
  actualites,
}: {
  actualites: ActualitePrefecture[];
}) {
  return (
    <div className="rounded-lg border-2 border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">
        Derniers communiqués de la préfecture
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Liste extraite automatiquement de la page officielle. Cliquez pour
        lire le communiqué complet sur le site de la préfecture.
      </p>
      <ol className="mt-3 space-y-3">
        {actualites.map((item) => (
          <li key={item.url} className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline decoration-2 underline-offset-2"
            >
              {item.titre}
            </a>
            <p className="mt-1 text-sm text-slate-500">Publié le {item.date}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
