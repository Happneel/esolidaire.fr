import type { Metadata } from "next";
import SignalerForm from "@/components/SignalerForm";

export const metadata: Metadata = {
  title: "Signaler un danger",
  description:
    "Préparez votre signalement et retrouvez le bon numéro ou le bon contact selon la situation.",
};

export default function SignalerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Signaler un danger
      </h1>
      <p className="mt-3 text-lg text-slate-700">
        Ce site n&apos;affiche aucun signalement publiquement. Selon votre
        situation, nous vous orientons vers le bon numéro d&apos;urgence ou
        vers votre mairie.
      </p>

      <div className="mt-6 rounded-lg border-2 border-slate-200 bg-white p-4 sm:p-6">
        <SignalerForm />
      </div>
    </div>
  );
}
