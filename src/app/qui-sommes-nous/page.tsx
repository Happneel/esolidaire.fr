import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui sommes-nous",
};

export default function QuiSommesNousPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Qui sommes-nous
      </h1>

      <div className="mt-6 space-y-6 text-slate-800">
        <p>
          Mon Espace Solidaire est un projet citoyen indépendant. Il n&apos;est
          rattaché à aucune administration, collectivité ou service de
          secours.
        </p>
        <p>
          Notre objectif : aider les personnes touchées par une catastrophe
          (incendie, inondation, tempête, canicule…) à retrouver rapidement
          les bonnes informations officielles et les bons contacts, sans
          recréer ce qui existe déjà. Quand un service fiable existe déjà
          (secours, bénévolat, hébergement solidaire, recherche de proches),
          nous y renvoyons plutôt que de le dupliquer.
        </p>
        <p>
          Ce site est développé par une seule personne, par itérations. Le
          périmètre s&apos;élargit progressivement, en donnant toujours la
          priorité à la fiabilité et à la simplicité sur la richesse
          fonctionnelle.
        </p>
        <p>
          Pour en savoir plus sur nos engagements et nos limites, consultez
          les{" "}
          <Link href="/mentions-legales" className="underline">
            mentions légales
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
