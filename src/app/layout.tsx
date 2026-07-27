import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: {
    default: "Mon Espace Solidaire",
    template: "%s | Mon Espace Solidaire",
  },
  description:
    "Plateforme citoyenne indépendante d'entraide en cas de catastrophe : situation officielle, ressources pratiques et signalement.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className="flex min-h-full flex-col antialiased"
        suppressHydrationWarning
      >
        <a href="#contenu" className="skip-link rounded-md bg-slate-900 px-4 py-2 text-white">
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
