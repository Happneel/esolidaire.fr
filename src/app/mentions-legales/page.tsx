import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Mentions légales
      </h1>

      <div className="mt-6 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-red-900">
        <p className="font-bold">
          En cas de danger immédiat, appelez le 18, le 15 ou le 112.
        </p>
      </div>

      <div className="mt-6 space-y-6 text-slate-800">
        <section>
          <h2 className="text-xl font-bold text-slate-900">
            Statut de la plateforme
          </h2>
          <p className="mt-2">
            Mon Espace Solidaire (esolidaire.fr) est une plateforme citoyenne
            indépendante. Elle n&apos;est ni un service de l&apos;État, ni un
            service public, ni géré par une administration, une préfecture ou
            une mairie. Aucun logo, nom ou présentation de ce site ne doit
            être compris comme un signe officiel de l&apos;État.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">
            Limites de responsabilité
          </h2>
          <p className="mt-2">
            Ce site ne remplace en aucun cas les services de secours, les
            autorités locales ou votre assureur. Les informations affichées
            renvoient vers des sources officielles tierces : nous nous
            efforçons de les tenir à jour, mais seule la source d&apos;origine
            fait foi. En cas d&apos;écart entre ce site et une source
            officielle, la source officielle prévaut toujours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">
            Données personnelles
          </h2>
          <p className="mt-2">
            Cette version du site ne crée pas de compte utilisateur et ne
            collecte aucune donnée de santé. Le formulaire « Signaler un
            danger » ne transmet ni ne conserve aucune information : tout se
            passe dans votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p className="mt-2">
            Pour toute question sur la plateforme, écrivez à{" "}
            <a href="mailto:contact@esolidaire.fr" className="underline">
              contact@esolidaire.fr
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Hébergement</h2>
          <p className="mt-2">
            Informations d&apos;hébergement à compléter avant la mise en
            production définitive.
          </p>
        </section>
      </div>
    </div>
  );
}
