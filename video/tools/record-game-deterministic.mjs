// Deterministic 24fps capture of the REAL Vault Run 3D game.
// Drives Chrome's virtual time + BeginFrameControl: each output frame is
// rendered exactly 1/24s apart in game-time, regardless of how slow software
// WebGL is in wall-time. Result: perfectly smooth real-gameplay footage.
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME =
  "/home/user/aigo-pitch/video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell";
const OUT = "/tmp/gamerec3";
const FPS = 24;
const DURATION_S = 42; // virtual seconds of gameplay
const FRAMES = FPS * DURATION_S;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "frames"), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    "--enable-begin-frame-control",
    "--run-all-compositor-stages-before-draw",
    "--disable-new-content-rendering-timeout",
    "--disable-threaded-animation",
    "--disable-threaded-scrolling",
    "--disable-checker-imaging",
  ],
  protocolTimeout: 600_000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

console.log("loading…");
await page.goto("https://gman-top.github.io/vault-run/", {
  waitUntil: "networkidle2",
  timeout: 90_000,
});
await sleep(7000); // boot in real time

// canvas rect for the clean stage-only crop in post
const rect = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
});
console.log("CANVAS RECT:", JSON.stringify(rect));

const clickByText = (t) =>
  page.evaluate((txt) => {
    const els = [...document.querySelectorAll("button, [role=button], a")];
    const el = els.find((e) =>
      (e.textContent || "").toLowerCase().includes(txt.toLowerCase())
    );
    if (el) {
      el.click();
      return (el.textContent || "").replace(/\s+/g, " ").slice(0, 40);
    }
    return null;
  }, t);

const cdp = await page.createCDPSession();

// switch to virtual time
async function advance(ms) {
  await new Promise(async (resolve) => {
    const onExpire = () => {
      cdp.off("Emulation.virtualTimeBudgetExpired", onExpire);
      resolve();
    };
    cdp.on("Emulation.virtualTimeBudgetExpired", onExpire);
    await cdp.send("Emulation.setVirtualTimePolicy", {
      policy: "advance",
      budget: ms,
    });
  });
}

// schedule of in-game actions (virtual seconds)
const ACTIONS = [
  [0.5, "$100"],
  [1.5, "JOIN"],
  [8.0, "Hack Lasers"],
  [14.0, "Open Bonus Vault"],
  [21.0, "Disable Drone"],
  [26.0, "JOIN"],
  [33.0, "Open Bonus Vault"],
  [38.0, "Rush Exit"],
];
let nextAction = 0;

const frameMs = 1000 / FPS;
let lastShot = null;
const t0 = Date.now();
console.log(`capturing ${FRAMES} frames @ ${FPS}fps (virtual)…`);

for (let f = 0; f < FRAMES; f++) {
  const vts = (f * frameMs) / 1000;
  while (nextAction < ACTIONS.length && ACTIONS[nextAction][0] <= vts) {
    const [, label] = ACTIONS[nextAction++];
    const hit = await clickByText(label);
    console.log(`vt+${vts.toFixed(1)}s click "${label}" -> ${hit ?? "MISS"}`);
  }
  await advance(frameMs);
  let shot;
  try {
    const res = await cdp.send("HeadlessExperimental.beginFrame", {
      screenshot: { format: "jpeg", quality: 92 },
    });
    shot = res.screenshotData ?? lastShot;
  } catch (e) {
    shot = lastShot;
    if (f < 3) console.log("beginFrame err:", String(e).slice(0, 120));
  }
  if (!shot) continue;
  lastShot = shot;
  fs.writeFileSync(
    path.join(OUT, "frames", `f${String(f + 1).padStart(6, "0")}.jpg`),
    Buffer.from(shot, "base64")
  );
  if ((f + 1) % 100 === 0) {
    const elapsed = (Date.now() - t0) / 1000;
    const rate = (f + 1) / elapsed;
    console.log(
      `frame ${f + 1}/${FRAMES} | wall ${elapsed.toFixed(0)}s | ${rate.toFixed(1)} f/s | ETA ${((FRAMES - f - 1) / rate / 60).toFixed(1)}min`
    );
  }
}
console.log(`CAPTURE DONE in ${((Date.now() - t0) / 60000).toFixed(1)}min, rect=${JSON.stringify(rect)}`);
await browser.close();
