/* AIGO PITCH — access gate (client-side passcode)
   ------------------------------------------------------------------
   IMPORTANT: this is a deterrent, not real security. A static site is
   delivered in full to the browser, so a determined visitor can read
   the page source / DOM regardless of this gate. Treat it as a velvet
   rope that keeps casual / non-technical visitors out. For true access
   control use an edge auth layer (e.g. Cloudflare Access) or encrypt
   the page contents. The passcode itself is never stored here in clear
   text — only the SHA-256 digest of it is.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var KEY = "aigo_unlocked";
  var DIGEST = "480d83233ad8861e7cb8fb5c321f26ac5e4b3c38c1de57fa56c65553848d8da4"; // sha-256 of the passcode

  var body = document.body;
  var lock = document.getElementById("lock");
  if (!lock) { body.classList.remove("locked"); return; }

  // already authorized in this browser session → skip the gate entirely
  try { if (sessionStorage.getItem(KEY) === "1") { reveal(true); return; } } catch (e) {}

  var form  = document.getElementById("lock-form");
  var input = document.getElementById("lock-input");
  var msg   = document.getElementById("lock-msg");
  var inner = lock.querySelector(".lock-inner");
  var boot  = document.getElementById("lock-boot");

  setTimeout(function () { try { input.focus(); } catch (e) {} }, 450);

  function toHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
  }

  function sha256(str) {
    if (!(window.crypto && window.crypto.subtle)) return Promise.resolve(null);
    return window.crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(str))
      .then(toHex);
  }

  function deny(text) {
    msg.textContent = text || "ACCESS DENIED";
    msg.className = "lock-msg err";
    inner.classList.remove("lock-deny");
    void inner.offsetWidth; // restart the shake animation
    inner.classList.add("lock-deny");
    input.value = "";
    try { input.focus(); } catch (e) {}
  }

  // open the deck. instant=true → no animation (returning session / reduced motion)
  function reveal(instant) {
    body.classList.remove("locked");
    if (instant) {
      if (lock.parentNode) lock.parentNode.removeChild(lock);
      return;
    }
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lock.classList.add("unlocked");
    setTimeout(function () {
      if (lock.parentNode) lock.parentNode.removeChild(lock);
    }, reduce ? 200 : 2300);
  }

  function grant() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    msg.textContent = "ACCESS GRANTED";
    msg.className = "lock-msg ok";
    if (boot) {
      ["AUTHORIZING…", "REAL-TIME CORE · ONLINE", "OPENING THE VAULT"].forEach(function (line, i) {
        setTimeout(function () { boot.innerHTML += (i ? "<br>" : "") + line; }, 220 + i * 250);
      });
    }
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () { reveal(false); }, reduce ? 60 : 1050);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = (input.value || "").trim();
    if (!val) return;
    msg.textContent = "";
    msg.className = "lock-msg";
    sha256(val).then(function (h) {
      if (h === null) { deny("SECURE CONTEXT REQUIRED"); return; }
      if (h === DIGEST) grant(); else deny();
    });
  });
})();
