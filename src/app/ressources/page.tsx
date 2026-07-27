import type { Metadata } from "next";
import RessourcesSearch from "@/components/RessourcesSearch";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Fiches pratiques pour les personnes touchées par une catastrophe : urgence, contacts utiles, assurance, droits.",
};

export default function RessourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Ressources pratiques
      </h1>
      <p className="mt-3 text-lg text-slate-700">
        Des fiches simples pour savoir quoi faire et qui contacter. Cette
        page reste disponible même sans connexion internet.
      </p>

      <div className="mt-6">
        <RessourcesSearch />
      </div>
    </div>
  );
}
