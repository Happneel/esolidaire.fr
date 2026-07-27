export default function SourceLinkCard({
  titre,
  description,
  url,
  verifieLe,
}: {
  titre: string;
  description: string;
  url: string;
  verifieLe: string;
}) {
  return (
    <div className="rounded-lg border-2 border-slate-200 bg-white p-4">
      <h3 className="text-lg font-bold text-slate-900">{titre}</h3>
      <p className="mt-1 text-slate-700">{description}</p>
      <p className="mt-2 text-sm text-slate-500">
        Source officielle · lien vérifié le {verifieLe}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center rounded-md bg-teal-700 px-4 py-2 text-base font-medium text-white hover:bg-teal-800"
      >
        Consulter {titre}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    </div>
  );
}
