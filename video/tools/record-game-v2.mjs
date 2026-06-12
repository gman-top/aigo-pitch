// Record REAL Vault Run gameplay WITH the 3D stage rendering (SwANGLE WebGL).
// Take A: authentic full UI. Take B: stage-only full-bleed 3D (panels hidden,
// canvas resized fullscreen) while still voting via JS clicks.
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME =
  "/home/user/aigo-pitch/video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell";
const OUT = "/tmp/gamerec2";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "frames"), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickByText(page, text) {
  return page.evaluate((t) => {
    const els = [...document.querySelectorAll("button, [role=button], a")];
    const el = els.find((e) =>
      (e.innerText || "").toLowerCase().includes(t.toLowerCase())
    );
    if (el) {
      el.click();
      return (el.innerText || "").replace(/\s+/g, " ").slice(0, 50);
    }
    return null;
  }, text);
}

// Hide everything except the 3D canvas lineage; fullscreen the stage.
async function isolateStage(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return "no canvas";
    let node = canvas;
    while (node.parentElement && node.parentElement !== document.body) {
      for (const sib of node.parentElement.children) {
        if (sib !== node) sib.style.visibility = "hidden";
      }
      node = node.parentElement;
    }
    // fullscreen the canvas's own container chain
    let c = canvas;
    while (c && c !== document.body) {
      c.style.position = "fixed";
      c.style.inset = "0";
      c.style.width = "100vw";
      c.style.height = "100vh";
      c.style.maxWidth = "none";
      c.style.maxHeight = "none";
      c.style.zIndex = "9999";
      c = c.parentElement;
    }
    document.body.style.background = "#05060a";
    window.dispatchEvent(new Event("resize"));
    return `isolated, canvas ${canvas.width}x${canvas.height}`;
  });
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto("https://gman-top.github.io/vault-run/", {
  waitUntil: "networkidle2",
  timeout: 90_000,
});
await sleep(8000);

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

const t0 = Date.now();
const log = (m) =>
  console.log(`t+${((Date.now() - t0) / 1000).toFixed(1)}s ${m}`);

// ---- TAKE A: authentic full UI (~65s) ----
log("TAKE A start (full UI)");
const planA = [
  [2000, "$100"],
  [3500, "JOIN"],
  [10000, "Hack Lasers"],
  [20000, "Open Bonus Vault"],
  [30000, "Disable Drone"],
  [38000, "JOIN"],
  [46000, "Open Bonus Vault"],
  [56000, "Rush Exit"],
];
for (const [at, label] of planA) {
  const wait = at - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
  log(`click "${label}" -> ${await clickByText(page, label)}`);
}
const takeAEnd = 65000 - (Date.now() - t0);
if (takeAEnd > 0) await sleep(takeAEnd);
const splitFrame = i;
log(`TAKE A done at frame ${splitFrame}`);

// ---- TAKE B: stage-only full-bleed 3D (~55s) ----
log("isolating stage: " + (await isolateStage(page)));
await sleep(1500);
const planB = [
  [70000, "JOIN"],
  [78000, "Hack Lasers"],
  [88000, "Open Bonus Vault"],
  [98000, "Disable Drone"],
  [106000, "JOIN"],
  [113000, "Rush Exit"],
];
for (const [at, label] of planB) {
  const wait = at - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
  log(`click "${label}" -> ${await clickByText(page, label)}`);
}
const end = 122000 - (Date.now() - t0);
if (end > 0) await sleep(end);

await cdp.send("Page.stopScreencast");
await sleep(500);

// VFR concat lists for both takes
function writeList(name, from, to) {
  const lines = [];
  for (let k = from; k < to; k++) {
    lines.push(`file 'frames/f${String(k + 1).padStart(6, "0")}.jpg'`);
    const dur =
      k < to - 1 ? Math.max(0.001, meta[k + 1] - meta[k]) : 0.06;
    lines.push(`duration ${dur.toFixed(4)}`);
  }
  fs.writeFileSync(path.join(OUT, name), lines.join("\n") + "\n");
}
writeList("listA.txt", 0, splitFrame);
writeList("listB.txt", splitFrame, meta.length);

const span = meta[meta.length - 1] - meta[0];
console.log(
  `DONE total=${meta.length} split@${splitFrame} span=${span.toFixed(1)}s fps=${(meta.length / span).toFixed(1)}`
);
await browser.close();
