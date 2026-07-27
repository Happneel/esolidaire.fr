import CommuneSelector from "@/components/CommuneSelector";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        La situation officielle, commune par commune
      </h1>
      <p className="mt-3 text-lg text-slate-700">
        Sélectionnez votre commune pour retrouver, en un seul endroit, les
        liens vers les informations officielles qui vous concernent :
        vigilance météo, risques connus, crues, préfecture.
      </p>

      <div className="mt-6 rounded-lg border-2 border-slate-200 bg-white p-4 sm:p-6">
        <CommuneSelector />
      </div>

      <div className="mt-8 rounded-lg border-2 border-red-200 bg-red-50 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-red-900">Danger immédiat ?</h2>
        <p className="mt-2 text-red-900">
          N&apos;attendez pas : appelez le{" "}
          <a href="tel:18" className="font-bold underline">18 (pompiers)</a>,
          le <a href="tel:15" className="font-bold underline">15 (SAMU)</a>{" "}
          ou le{" "}
          <a href="tel:112" className="font-bold underline">112 (numéro d&apos;urgence européen)</a>.
        </p>
      </div>
    </div>
  );
}
