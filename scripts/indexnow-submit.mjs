// Submits every URL in the live sitemap to IndexNow (api.indexnow.org),
// which fans out to all participating search engines (Bing, Yandex, etc.
// — not Google, which has no IndexNow support and relies on its own crawl).
//
// Re-run this after any content change that should be picked up fast —
// it's not a one-time setup step. Key verification file lives at
// public/<key>.txt and must match KEY exactly.
//
// Usage: node scripts/indexnow-submit.mjs

const HOST = "sgctech.ai";
const KEY = "ef82664e0b985e967198cb07ef30bfcd";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  if (urlList.length === 0) {
    throw new Error("No <loc> entries found in sitemap — aborting.");
  }

  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const submitRes = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  console.log(`IndexNow response: ${submitRes.status} ${submitRes.statusText}`);
  const body = await submitRes.text();
  if (body) console.log(body);

  if (submitRes.status !== 200 && submitRes.status !== 202) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
