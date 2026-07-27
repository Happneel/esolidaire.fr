// Service worker de Mon Espace Solidaire.
// Deux stratégies volontairement différentes :
// - Pages "Situation" (/ et /commune/*) : network-first, on veut la donnée la
//   plus fraîche possible, et on ne retombe sur le cache ("dernière donnée
//   connue") qu'en cas d'échec réseau. La page elle-même affiche l'horodatage.
// - Pages peu volatiles (Ressources, Signaler, Mentions légales, Qui sommes-
//   nous, fichiers statiques) : cache-first, rapide et fiable hors-ligne,
//   avec mise à jour du cache en arrière-plan à chaque visite en ligne.

const CACHE_NAME = "esolidaire-v1";

const APP_SHELL = [
  "/",
  "/ressources",
  "/signaler",
  "/mentions-legales",
  "/qui-sommes-nous",
  "/manifest.webmanifest",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          APP_SHELL.map((url) =>
            fetch(url, { cache: "no-store" })
              .then((res) => (res.ok ? cache.put(url, res) : null))
              .catch(() => null),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSituationRoute(pathname) {
  return pathname === "/" || pathname.startsWith("/commune/");
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Hors ligne et rien en cache pour cette page.");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Rafraîchit le cache en tâche de fond, sans faire attendre l'utilisateur.
    networkPromise.catch(() => {});
    return cached;
  }

  const network = await networkPromise;
  if (network) return network;
  throw new Error("Hors ligne et rien en cache pour cette ressource.");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isSituationRoute(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
