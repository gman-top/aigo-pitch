// Record REAL Vault Run gameplay from the live build using Remotion's
// headless Chrome + CDP screencast. Plays the game programmatically
// (bet → join run → room votes) while capturing 1080p frames.
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME =
  "/home/user/aigo-pitch/video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell";
const URL = "https://gman-top.github.io/vault-run/";
const OUT = "/tmp/gamerec";
const RECORD_MS = 75_000;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "frames"), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Click a button containing `text` (case-insensitive). React-safe .click().
async function clickByText(page, text) {
  return page.evaluate((t) => {
    const els = [...document.querySelectorAll("button, [role=button], a")];
    const el = els.find((e) =>
      (e.innerText || "").toLowerCase().includes(t.toLowerCase())
    );
    if (el) {
      el.click();
      return (el.innerText || "").slice(0, 60);
    }
    return null;
  }, text);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors", // proxy CA breaks gstatic fonts otherwise
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    "--autoplay-policy=no-user-gesture-required",
    "--use-gl=swiftshader",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

console.log("loading game…");
await page.goto(URL, { waitUntil: "networkidle2", timeout: 90_000 });
await sleep(6000); // let the app boot + first round spin up

// Log available buttons so we know what we can press
const buttons = await page.evaluate(() =>
  [...document.querySelectorAll("button")]
    .map((b) => (b.innerText || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 40)
);
console.log("BUTTONS:", JSON.stringify(buttons));

// --- start screencast ---
const cdp = await page.createCDPSession();
let i = 0;
const meta = [];
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const n = ++i;
  fs.writeFileSync(
    path.join(OUT, "frames", `f${String(n).padStart(6, "0")}.jpg`),
    Buffer.from(data, "base64")
  );
  meta.push(metadata.timestamp);
  try {
    await cdp.send("Page.screencastFrameAck", { sessionId });
  } catch {}
});
await cdp.send("Page.startScreencast", {
  format: "jpeg",
  quality: 92,
  maxWidth: 1920,
  maxHeight: 1080,
  everyNthFrame: 1,
});
console.log("recording…");

// --- play the game while recording ---
const script = [
  [1500, "$50"],
  [3000, "JOIN"],
  [9000, "Hack Lasers"],
  [16000, "Disable Drone"],
  [24000, "Open Bonus Vault"],
  [33000, "JOIN"],
  [40000, "Rush Exit"],
  [48000, "Hack Lasers"],
  [56000, "JOIN"],
  [63000, "Open Bonus Vault"],
];
const t0 = Date.now();
for (const [at, label] of script) {
  const wait = at - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
  const hit = await clickByText(page, label);
  console.log(`t+${((Date.now() - t0) / 1000).toFixed(1)}s click "${label}" -> ${hit ?? "NOT FOUND"}`);
}
const remaining = RECORD_MS - (Date.now() - t0);
if (remaining > 0) await sleep(remaining);

await cdp.send("Page.stopScreencast");
await sleep(500);

// concat list with real per-frame durations for VFR-accurate assembly
const lines = [];
for (let k = 0; k < meta.length; k++) {
  const file = `frames/f${String(k + 1).padStart(6, "0")}.jpg`;
  lines.push(`file '${file}'`);
  const dur =
    k < meta.length - 1 ? Math.max(0.001, meta[k + 1] - meta[k]) : 0.04;
  lines.push(`duration ${dur.toFixed(4)}`);
}
fs.writeFileSync(path.join(OUT, "list.txt"), lines.join("\n") + "\n");

const span = meta.length > 1 ? meta[meta.length - 1] - meta[0] : 0;
console.log(
  `DONE frames=${meta.length} span=${span.toFixed(1)}s avg_fps=${(meta.length / Math.max(span, 0.01)).toFixed(1)}`
);
await browser.close();
