"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Le mode hors-ligne est une amélioration, pas un pré-requis :
      // on n'affiche rien à l'utilisateur si l'enregistrement échoue.
    });
  }, []);

  return null;
}
