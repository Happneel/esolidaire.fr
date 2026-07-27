// Script ponctuel : vérifie l'URL de préfecture + la page /Actualites pour
// les 101 départements français. Lancé manuellement, pas utilisé au runtime.
// Usage: node scripts/verify-prefectures.mjs > scripts/prefectures-report.json

const OVERRIDES = {
  "75": "prefecturedepolice.interieur.gouv.fr",
};

function slugify(nom) {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function testUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "MonEspaceSolidaire/1.0 (+https://esolidaire.fr)" },
    });
    return res.status;
  } catch {
    return 0;
  }
}

async function countCards(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "MonEspaceSolidaire/1.0 (+https://esolidaire.fr)" },
    });
    if (!res.ok) return 0;
    const html = await res.text();
    const matches = html.match(/fr-card__link/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const res = await fetch("https://geo.api.gouv.fr/departements?fields=nom,code");
  const departements = await res.json();
  departements.sort((a, b) => a.code.localeCompare(b.code));

  const results = [];
  for (const dep of departements) {
    const domain = OVERRIDES[dep.code] ?? `${slugify(dep.nom)}.gouv.fr`;
    const baseUrl = `https://www.${domain}/`;
    const actualitesUrl = `https://www.${domain}/Actualites`;

    const statusBase = await testUrl(baseUrl);
    await sleep(120);
    const cards = statusBase === 200 ? await countCards(actualitesUrl) : 0;
    await sleep(120);

    results.push({
      code: dep.code,
      nom: dep.nom,
      domain,
      baseUrl,
      statusBase,
      actualitesUrl,
      cards,
    });
    process.stderr.write(`${dep.code} ${dep.nom} -> base=${statusBase} cards=${cards}\n`);
  }

  console.log(JSON.stringify(results, null, 2));
}

main();
