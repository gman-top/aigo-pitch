/* AIGO PITCH — build the encrypted index.html
   ------------------------------------------------------------------
   Reads the editable deck (deck.src.html), encrypts it with AES-256-GCM
   using a key derived from the passcode via PBKDF2 (SHA-256), and writes
   the encrypted shell to index.html (what GitHub Pages serves).

   Usage:
     node encrypt.mjs                 # uses the default passcode below
     AIGO_PASS='your passcode' node encrypt.mjs

   Workflow when editing the deck:
     1. edit deck.src.html
     2. node encrypt.mjs
     3. commit deck.src.html + index.html
   ------------------------------------------------------------------ */
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const PASS = process.env.AIGO_PASS || "hypergames";
const ITERATIONS = 200000;

const src = readFileSync("deck.src.html");          // Buffer (bytes to encrypt)
const tpl = readFileSync("shell.template.html", "utf8");

if (!tpl.includes("__AIGO_PAYLOAD__")) {
  throw new Error("shell.template.html is missing the __AIGO_PAYLOAD__ placeholder");
}

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(PASS), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);
const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, src);

const b64 = (buf) => Buffer.from(buf).toString("base64");
const payload = JSON.stringify({
  v: 1,
  iter: ITERATIONS,
  salt: b64(salt),
  iv: b64(iv),
  ct: b64(new Uint8Array(ciphertext)),
});

writeFileSync("index.html", tpl.replace("__AIGO_PAYLOAD__", payload));
console.log(`Encrypted ${src.length} bytes of deck.src.html -> index.html (${b64(new Uint8Array(ciphertext)).length} b64 chars of ciphertext).`);
