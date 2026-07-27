# Mon Espace Solidaire (esolidaire.fr)

Plateforme citoyenne indépendante d'entraide en cas de catastrophe
(incendie, inondation, tempête, canicule…), pensée en priorité pour les
personnes actuellement touchées par une crise.

Ce document sert de mémoire technique du projet : choix d'architecture,
état d'avancement, limites connues. À tenir à jour à chaque itération.

Projet sous licence [MIT](LICENSE) — libre de réutilisation, y compris par
d'autres communes ou développeurs, sans obligation de repartager les
modifications.

## État actuel : MVP 0 + intégrations temps réel + couverture nationale

Site quasi-statique (ISR pour la Situation), **sans compte utilisateur ni
base de données**, livrant :

- `/` — Sélection de commune (recherche ou géolocalisation), **sur
  l'ensemble des communes de France** via l'API officielle
  `geo.api.gouv.fr` (voir « Couverture nationale des communes »).
- `/commune/[code]` — Module Situation par code INSEE : liens sourcés et
  horodatés vers Météo-France Vigilance, Géorisques, Vigicrues (si un
  tronçon surveillé est à proximité) et la préfecture, + QR code
  imprimable de la page. Deux sources sont **auto-actualisées** (voir
  « Intégrations temps réel » ci-dessous) : le cours d'eau Vigicrues le
  plus proche et les derniers communiqués de la préfecture, quand
  disponibles pour le département.
- `/ressources` — Fiches pratiques (urgence, contacts utiles, assurance,
  droits du sinistré, bénévolat/solidarité) avec recherche.
- `/signaler` — Aide à la décision en cas de danger : redirige vers les
  numéros d'urgence (danger vital) ou aide à préparer un message pour la
  mairie (non vital), avec recherche de commune et **lien direct vers la
  fiche de la mairie sur l'annuaire officiel** quand la commune n'est pas
  ambiguë (voir « Lien direct vers la mairie » ci-dessous). **Ne transmet
  ni ne stocke aucune donnée.**
- `/mentions-legales`, `/qui-sommes-nous` — Statut de la plateforme,
  limites de responsabilité, disclaimer d'urgence permanent (footer).
- Mode hors-ligne via service worker (voir plus bas).

## Intégrations temps réel (Situation)

Deux sources officielles s'actualisent automatiquement, sans base de
données : simple `fetch` avec revalidation Next.js (ISR), rafraîchi en
arrière-plan à intervalle régulier.

**Vigicrues** (`src/lib/vigicrues.ts`) — Choix volontairement prudent :
l'API ouverte (`services/1/InfoVigiCru.geojson`, aucune clé requise) expose
un niveau de vigilance par tronçon, mais ses métadonnées de date
(`dhcentcru`/`dhmentcru`) sont figées depuis 2020 dans nos tests, sans
certitude que le niveau lui-même soit rafraîchi en temps réel dans ce
flux. **On n'affiche donc jamais de couleur de vigilance calculée par nos
soins** — le risque d'une fausse info sur une alerte crue est trop élevé.
On utilise uniquement la géométrie (factuelle, quasi-statique) pour
identifier automatiquement le cours d'eau surveillé le plus proche de la
commune (nom + distance), avec un lien direct vers la carte officielle
pour le niveau en temps réel. Revalidation : 6h (la géométrie ne change
quasiment jamais). Le fichier fait ~3 Mo, au-dessus de la limite de cache
fetch de Next.js (2 Mo) : l'avertissement `Failed to set Next.js data
cache` au build est attendu et sans conséquence sur l'ISR de la page.

**Communiqués de préfecture** (`src/lib/prefectureActualites.ts`) — Il
n'existe pas de flux RSS/Atom exploitable sur les sites préfecture (vérifié
sur plusieurs départements). En revanche, une large partie d'entre eux
partage la même plateforme gouvernementale (« IDE ») avec une page
`/Actualites` au balisage stable. On extrait uniquement **titre + date +
lien** de chaque communiqué (jamais le contenu de l'article, qui reste sur
le site de la préfecture) et on les affiche triés par date, avec
dégradation silencieuse vers le simple lien préfecture si le format ne
correspond pas ou si la requête échoue. Revalidation : 15 min. Ce champ
(`actualitesUrl` dans `src/lib/departements.ts`) n'est renseigné que pour
les préfectures **vérifiées manuellement** (voir « Couverture des 101
départements » ci-dessous) — les autres n'affichent que le lien préfecture
existant, sans erreur ni contenu manquant visible.

**Important — bonne conduite envers ces sites publics** : ces intégrations
appellent des sites institutionnels partagés, pas taillés pour du trafic
API. Toujours espacer largement les requêtes de vérification manuelle
(voir plus bas, une rafale de ~200 requêtes en quelques secondes a suffi à
déclencher un blocage temporaire de notre IP par leur protection anti-bot).
En production, l'ISR + le cache de données de Next.js déduplique déjà les
requêtes vers une même préfecture entre toutes les communes d'un même
département — ne jamais court-circuiter ce cache par un appel direct
répété.

## Lien direct vers la mairie (`/signaler`)

`src/lib/mairieAnnuaire.ts` (appelé via la route serveur `src/app/api/mairie/route.ts`,
nécessaire car lannuaire.service-public.gouv.fr n'autorise pas les appels
directs depuis le navigateur — pas de CORS) résout le lien vers la fiche
mairie d'une commune sur l'annuaire officiel de l'administration.

La page de résultats de recherche de l'annuaire contient déjà, en HTML, le
lien direct vers la fiche mairie **quand la recherche ne renvoie qu'un seul
résultat** (vérifié en conditions réelles : `Lacanau` → un lien direct avec
UUID ; `Saint-Martin` → 20+ résultats, ambigu). On n'utilise ce lien direct
que dans le cas non ambigu ; sinon on renvoie vers la page de recherche
elle-même, pour ne jamais risquer d'envoyer quelqu'un vers la mauvaise
mairie (mairie annexe, homonyme d'une autre commune...). Résultat mis en
cache 1h par commune recherchée (peu volatile, et pour ne pas solliciter ce
site à chaque frappe).

**Ce qui reste volontairement hors scope** : le suivi tactique d'un
incident (périmètre exact d'un feu, distance précise, état des opérations
de secours, largages de retardant...). Il n'existe aucune API publique
officielle à ce niveau de détail en France ; le construire nécessiterait
soit un partenariat institutionnel non garanti (contraire à la règle
produit sur l'indépendance technique), soit d'agréger des sources non
officielles (réseaux sociaux, presse) — ce qui revient à la carte de
signalements non modérés explicitement exclue du projet, avec un risque
réel qu'une information fausse ou en retard mette quelqu'un en danger.

## Stack et choix d'architecture

| Choix | Détail | Pourquoi |
|---|---|---|
| Next.js 16 (App Router) | TypeScript, Turbopack | SSG par défaut pour ce périmètre → app-shell léger, scale horizontalement sans réécriture |
| Tailwind CSS v4 | via `@tailwindcss/postcss` | Aller vite sur un design cohérent et accessible |
| Aucune base de données | Données en dur dans `src/lib/*.ts` | Rien dans le MVP 0 n'a besoin de persistance ; à introduire seulement à partir des modules qui en ont réellement besoin (Entraide, Dons, Missions) |
| Aucune authentification | — | Pas de compte utilisateur en MVP 0 |
| Police système (pas de Google Font) | `font-family: system-ui, ...` | Payload minimal sur le parcours critique, pas de police custom volumineuse à charger |
| Thème clair unique (pas de dark mode auto) | — | Simplicité radicale et contraste maîtrisé plutôt qu'un second thème non audité pour l'accessibilité |
| Service worker écrit à la main (pas de `next-pwa`) | `public/sw.js` | Contrôle précis des deux stratégies de cache requises (voir ci-dessous), évite les frictions connues de certaines libs PWA avec l'App Router |
| Déploiement cible : Vercel | — | Gratuit pour ce volume, edge/serverless, scale sans réécriture |

## Mode hors-ligne

Le service worker (`public/sw.js`) applique **deux stratégies différentes**
selon la nature du contenu, conformément au besoin produit :

- **Situation** (`/` et `/commune/*`) : *network-first*. On essaie toujours
  d'avoir la donnée la plus fraîche ; on ne retombe sur le cache que si le
  réseau échoue. Les liens manuellement curatés (Météo-France, Géorisques,
  préfecture) affichent une date de vérification manuelle globale (voir
  `DERNIERE_VERIFICATION_LIENS` dans `src/lib/departements.ts`) ; le tronçon
  Vigicrues et les communiqués de préfecture sont désormais calculés à
  chaque régénération ISR (voir « Intégrations temps réel » plus haut), donc
  intrinsèquement à jour tant que la page a pu être régénérée.
- **Contenu peu volatile** (`/ressources`, `/signaler`, `/mentions-legales`,
  `/qui-sommes-nous`, fichiers statiques) : *cache-first*, avec
  rafraîchissement du cache en arrière-plan à chaque visite en ligne.

**Limite connue** : le service worker intercepte les requêtes de
navigation (chargement direct, rechargement, lien partagé/QR code) et les
sert depuis le cache si nécessaire. Il ne rejoue pas les appels internes de
React Server Components utilisés lors d'une navigation cliente déjà en
cours quand la connexion tombe en plein milieu d'une session : dans ce cas,
un rechargement de page reste nécessaire et fonctionne normalement hors
ligne. Le service worker ne s'enregistre qu'en production
(`NODE_ENV === "production"`) pour ne pas gêner le développement local.

## Couverture nationale des communes

Il n'y a plus de liste statique de communes dans le code. `src/lib/communesApi.ts`
appelle **geo.api.gouv.fr** (Etalab/IGN — ouvert, sans clé, CORS ouvert,
vérifié) pour :
- la recherche par nom (`CommuneSelector`, débouncée à 300 ms côté client) ;
- la commune la plus proche d'un point GPS (géolocalisation) — le calcul de
  proximité est fait par l'API elle-même, pas par nous ;
- le détail d'une commune par son **code INSEE** (`/commune/[code]`),
  revalidé toutes les 24h (donnée quasi-immuable).

Le code INSEE remplace l'ancien slug fait main : il est unique et stable
(contrairement à un nom, qui peut se répéter dans plusieurs départements).

## Couverture des 101 départements

`src/lib/departements.ts` liste les 101 départements (source :
geo.api.gouv.fr, référentiel stable) avec, quand vérifiées manuellement en
conditions réelles (test HTTP direct, pas un pattern deviné) :
`prefectureUrl` et `actualitesUrl`. État au 27 juillet 2026 : **42/101**
préfectures confirmées, dont **28** avec un fil d'actualités exploitable.
Les 59 départements restants affichent uniquement le renvoi générique vers
service-public.fr, sans rien casser.

Le fichier est généré par `scripts/generate-departements.mjs` à partir de
`scripts/departements-raw.json` (liste brute) + des résultats de vérification
codés en dur dans le script (`ACTUALITES_OK`, `PREFECTURE_BASE_OK`). Pour
étendre la couverture : relancer `scripts/verify-prefectures.mjs` avec des
délais **beaucoup plus généreux** que la version actuelle (plusieurs
secondes entre chaque requête, en plusieurs passes espacées dans le temps),
reporter les nouveaux codes confirmés dans `generate-departements.mjs`, puis
relancer le script de génération. **Ne jamais relancer une vérification en
rafale** : une première tentative avec seulement 120 ms de délai a suffi à
déclencher un blocage temporaire de notre IP par la protection anti-bot
partagée par ces sites (voir `scripts/prefectures-progress.log` pour le
détail de ce qui a été confirmé avant le blocage).

Les liens du module Ressources restent des domaines racines officiels bien
connus (service-public.fr, caf.fr, ameli.fr, jeveuxaider.gouv.fr,
airbnb.org, croix-rouge.fr, i-cad.fr), jamais des liens profonds devinés.

## Ce qui n'est volontairement pas construit ici

Conformément aux règles produit non négociables du projet : pas de carte
collaborative de signalements publics, pas de paiement/dons financiers, pas
de mise en relation pair-à-pair sur les sujets sensibles (logement, garde
d'enfants, assistance administrative, animaux), pas de champ pouvant capter
une donnée de santé, pas de dépendance technique à une validation
institutionnelle. Voir le prompt de cadrage produit pour le détail complet
et le périmètre des itérations suivantes (Étape 2 : Je suis en sécurité,
notifications géolocalisées, espace collectivités, entraide, dons,
animaux, missions...).

## À faire avant une mise en production réelle

- Remplacer `contact@esolidaire.fr` (mentions légales) par une vraie
  adresse, et compléter la section hébergement.
- Continuer à vérifier les URLs de préfecture/actualités des 59 départements
  restants (voir « Couverture des 101 départements »), lentement et en
  plusieurs passes.
- Remplacer `public/icon.svg` par de vraies icônes PWA (idéalement des PNG
  192×192 et 512×512, plus un `apple-touch-icon.png`, pour une
  compatibilité maximale avec l'installation sur iOS).
- Définir `NEXT_PUBLIC_SITE_URL` dans l'environnement de production (sinon
  les QR codes pointeront vers `https://esolidaire.fr` par défaut).
- Vérifier le comportement de geo.api.gouv.fr sous charge réelle (quotas,
  disponibilité) et envisager un cache applicatif si le volume d'usage le
  justifie un jour — pas nécessaire tant que le trafic reste modeste.

## Développement

```bash
npm install
npm run dev      # serveur de développement (service worker désactivé)
npm run build    # build de production (SSG + ISR pour /commune/*)
npm run start    # sert le build de production (service worker actif)
npm run lint
```

`npm run build` a besoin d'une connexion internet (appel à geo.api.gouv.fr
pour la liste des départements). Les pages `/commune/[code]` ne sont plus
pré-générées au build (impossible pour ~35 000 communes) : elles se
génèrent à la demande en production (ISR, revalidate 15 min), en appelant
Vigicrues, l'API commune et éventuellement la préfecture à ce moment-là.

## Checklist accessibilité rapide (à refaire à chaque nouvel écran)

- [ ] Contraste texte/fond ≥ 4.5:1 (texte normal), ≥ 3:1 (texte large/UI)
- [ ] Navigation clavier complète (Tab/Shift+Tab/Entrée), focus visible
- [ ] Cibles tactiles ≥ 44×44px
- [ ] Aucune information portée uniquement par la couleur
- [ ] Labels explicites sur tous les champs de formulaire
- [ ] `prefers-reduced-motion` respecté (pas d'animation imposée)
- [ ] Testé avec un lecteur d'écran (au moins NVDA ou VoiceOver)
- [ ] Titres de page (`<title>`) et hiérarchie de titres (`h1` → `h2`) cohérents

Statut MVP 0 : contraste vérifié visuellement (palette slate/teal/red sur
fond blanc), navigation clavier et labels en place sur tous les
formulaires, cibles tactiles à `min-h-11` (44px) partout, pas d'animation
hors `scroll-behavior: smooth` (désactivée si `prefers-reduced-motion`).
**Test lecteur d'écran réel non encore effectué** — à faire avant mise en
production.
