// Probe: does WebGL work + does the game's 3D stage render? Takes one screenshot.
import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME =
  "/home/user/aigo-pitch/video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell";

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
    // SwANGLE: software WebGL that actually works in headless (Remotion's cloud setting)
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

const logs = [];
page.on("console", (m) => logs.push(`${m.type()}: ${m.text().slice(0, 120)}`));
page.on("pageerror", (e) => logs.push(`PAGEERROR: ${String(e).slice(0, 160)}`));

await page.goto("https://gman-top.github.io/vault-run/", {
  waitUntil: "networkidle2",
  timeout: 90_000,
});
await new Promise((r) => setTimeout(r, 10_000)); // let the 3D stage boot

const info = await page.evaluate(() => {
  const probe = document.createElement("canvas");
  const canvases = [...document.querySelectorAll("canvas")].map((c) => ({
    w: c.width,
    h: c.height,
    cssW: c.clientWidth,
    cssH: c.clientHeight,
    ctx2d: !!c.__ctx2d,
  }));
  return {
    webgl: !!probe.getContext("webgl"),
    webgl2: !!probe.getContext("webgl2"),
    canvasCount: canvases.length,
    canvases,
    ua: navigator.userAgent.slice(0, 80),
  };
});
console.log("INFO:", JSON.stringify(info, null, 1));
console.log("CONSOLE (last 12):", JSON.stringify(logs.slice(-12), null, 1));

await page.screenshot({ path: "/tmp/probe-3d.jpg", type: "jpeg", quality: 92 });
console.log("screenshot saved");
await browser.close();
