import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">
          En cas de danger immédiat, appelez le 18, le 15 ou le 112.
        </p>
        <p className="mt-2">
          Mon Espace Solidaire est une plateforme citoyenne indépendante. Elle
          ne remplace pas les services de secours et n&apos;est pas un
          service de l&apos;État.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <li>
            <Link
              href="/mentions-legales"
              className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-2"
            >
              Mentions légales
            </Link>
          </li>
          <li>
            <Link
              href="/qui-sommes-nous"
              className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-2"
            >
              Qui sommes-nous
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
