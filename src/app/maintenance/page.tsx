import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site en cours de suppression",
  description:
    "Mon Espace Solidaire est en cours de suppression. Le site n'est plus accessible.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950 px-6 py-12">
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/40">
          <svg
            className="h-8 w-8 text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">
          Maintenance
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Site en cours de suppression
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-300">
          Mon Espace Solidaire est en cours de suppression définitive. Le site
          et l&apos;ensemble de ses contenus ne sont plus accessibles.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Nous vous remercions de l&apos;intérêt que vous avez porté à cette
          initiative citoyenne. En cas de catastrophe ou d&apos;urgence,
          consultez les canaux officiels&nbsp;: préfectures, mairies et le
          numéro d&apos;urgence européen&nbsp;112.
        </p>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500">
            Mon Espace Solidaire — plateforme citoyenne indépendante
          </p>
        </div>
      </div>
    </div>
  );
}
