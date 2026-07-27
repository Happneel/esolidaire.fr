import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Situation" },
  { href: "/ressources", label: "Ressources" },
  { href: "/signaler", label: "Signaler un danger" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-lg font-bold text-slate-900 no-underline"
        >
          Mon Espace Solidaire
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-md px-3 py-2 text-base font-medium text-slate-800 underline decoration-2 underline-offset-2 hover:bg-slate-100 hover:no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
