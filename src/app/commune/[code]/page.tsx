import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { communeParCode } from "@/lib/communesApi";
import { findDepartementByCode, DERNIERE_VERIFICATION_LIENS } from "@/lib/departements";
import { getTronconVigicruesProche } from "@/lib/vigicrues";
import { getActualitesPrefecture } from "@/lib/prefectureActualites";
import SourceLinkCard from "@/components/SourceLinkCard";
import FilActualitesPrefecture from "@/components/FilActualitesPrefecture";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://esolidaire.fr";

// Pas de generateStaticParams : ~35 000 communes en France, impossible (et
// inutile) à pré-générer entièrement au build. Chaque page se génère à la
// demande lors de sa première visite (ISR), puis se régénère en arrière-plan
// toutes les 15 min — alignée sur le fetch le plus court (actualités
// préfecture) ; vigicrues/commune se recalculent aussi à cette occasion sans
// perte de fraîcheur puisqu'ils changent bien plus lentement.
export const dynamicParams = true;
export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const commune = await communeParCode(code);
  if (!commune) return {};
  return {
    title: `Situation à ${commune.nom}`,
    description: `Informations officielles pour ${commune.nom} : vigilance météo, risques, préfecture.`,
  };
}

export default async function CommunePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const commune = await communeParCode(code);
  if (!commune) notFound();

  const departement = findDepartementByCode(commune.codeDepartement);

  const pageUrl = `${SITE_URL}/commune/${commune.code}`;
  const qrCodeSvg = await QRCode.toString(pageUrl, {
    type: "svg",
    margin: 1,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  const [troncon, actualites] = await Promise.all([
    getTronconVigicruesProche(commune.lat, commune.lon),
    departement?.actualitesUrl
      ? getActualitesPrefecture(departement.actualitesUrl)
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-slate-600">
        <Link href="/" className="underline">
          ← Changer de commune
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Situation à {commune.nom}
      </h1>
      <p className="mt-1 text-slate-600">
        {departement?.nom ?? "Département inconnu"} ({commune.codeDepartement})
      </p>

      <div className="mt-6 space-y-4">
        <SourceLinkCard
          titre="Météo-France Vigilance"
          description={`Vigilance météo en cours pour le département ${departement?.nom ?? commune.codeDepartement}. Recherchez le département ${commune.codeDepartement} sur la carte.`}
          url="https://vigilance.meteofrance.fr/fr"
          verifieLe={DERNIERE_VERIFICATION_LIENS}
        />
        <SourceLinkCard
          titre="Géorisques"
          description="Connaître les risques naturels et technologiques recensés pour votre adresse exacte."
          url="https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi"
          verifieLe={DERNIERE_VERIFICATION_LIENS}
        />
        {troncon && (
          <SourceLinkCard
            titre="Vigicrues"
            description={`Cours d'eau surveillé le plus proche : ${troncon.nom} (à environ ${troncon.distanceKm} km). Consultez le niveau de vigilance en temps réel sur la carte officielle.`}
            url="https://www.vigicrues.gouv.fr/"
            verifieLe={DERNIERE_VERIFICATION_LIENS}
          />
        )}
        {departement?.prefectureUrl ? (
          <SourceLinkCard
            titre={`Préfecture — ${departement.nom}`}
            description="Arrêtés, consignes locales et communiqués officiels de la préfecture."
            url={departement.prefectureUrl}
            verifieLe={DERNIERE_VERIFICATION_LIENS}
          />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-slate-600">
            Lien de la préfecture non encore vérifié pour ce département.
            Cherchez « préfecture {departement?.nom ?? commune.codeDepartement} » sur{" "}
            <a href="https://www.service-public.fr/" className="underline">
              service-public.fr
            </a>
            .
          </div>
        )}
      </div>

      {actualites && (
        <div className="mt-6">
          <FilActualitesPrefecture actualites={actualites} />
        </div>
      )}

      <div className="mt-8 rounded-lg border-2 border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Partager cette page
        </h2>
        <p className="mt-1 text-slate-700">
          Ce QR code renvoie directement à la situation de {commune.nom}. Il
          peut être imprimé et affiché en mairie ou dans un centre d&apos;accueil.
        </p>
        <div
          className="mt-3 h-40 w-40 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
        />
        <p className="mt-2 break-all text-sm text-slate-500">{pageUrl}</p>
      </div>
    </div>
  );
}
