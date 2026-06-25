/* AIGO PITCH — deck controller
   - keyboard nav (arrows / space / pgup-pgdn / home-end)
   - scroll-driven reveal animations + progress bar + slide counter
   - right-side nav dots
   - film modal
   - hover-to-play gameplay clips (lazy)
*/
(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var progress = document.getElementById("progress");
  var counterCur = document.querySelector("#counter .cur");
  var counterTot = document.querySelector("#counter .tot");
  var dotsWrap = document.getElementById("dots");
  var current = 0;

  if (counterTot) counterTot.textContent = String(slides.length).padStart(2, "0");

  /* ---- build nav dots ---- */
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(b);
  });
  var dotBtns = Array.prototype.slice.call(dotsWrap.children);

  /* ---- reveal + active tracking via IntersectionObserver ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        if (e.intersectionRatio > 0.5) setActive(slides.indexOf(e.target));
      }
    });
  }, { threshold: [0.15, 0.5, 0.75] });
  slides.forEach(function (s) { io.observe(s); });

  function setActive(i) {
    if (i < 0) return;
    current = i;
    dotBtns.forEach(function (d, j) { d.classList.toggle("active", j === i); });
    if (counterCur) counterCur.textContent = String(i + 1).padStart(2, "0");
  }

  /* ---- progress bar (scroll position over whole doc) ---- */
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    progress.style.width = (p * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- navigation ---- */
  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(i);
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.addEventListener("keydown", function (e) {
    if (filmOpen) {
      if (e.key === "Escape") closeFilm();
      return;
    }
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home": e.preventDefault(); goTo(0); break;
      case "End": e.preventDefault(); goTo(slides.length - 1); break;
    }
  });

  /* ---- film modal ---- */
  var modal = document.getElementById("film-modal");
  var filmVideo = document.getElementById("film-video");
  var filmOpen = false;

  function openFilm() {
    if (!modal) return;
    modal.classList.add("open");
    filmOpen = true;
    if (filmVideo) { filmVideo.currentTime = 0; filmVideo.play().catch(function(){}); }
  }
  function closeFilm() {
    if (!modal) return;
    modal.classList.remove("open");
    filmOpen = false;
    if (filmVideo) filmVideo.pause();
  }
  Array.prototype.slice.call(document.querySelectorAll("[data-film-open]")).forEach(function (el) {
    el.addEventListener("click", openFilm);
  });
  Array.prototype.slice.call(document.querySelectorAll("[data-film-close]")).forEach(function (el) {
    el.addEventListener("click", closeFilm);
  });
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeFilm(); });

  /* ---- hover-to-reveal gameplay frame (lazy attach src) ---- */
  Array.prototype.slice.call(document.querySelectorAll(".card[data-frame]")).forEach(function (card) {
    var clip = card.querySelector("img.clip");
    if (!clip) return;
    var loaded = false;
    function load() {
      if (loaded) return;
      loaded = true;
      var src = card.getAttribute("data-frame");
      if (src && !clip.src) clip.src = src;
    }
    card.addEventListener("pointerenter", load);
    card.addEventListener("mouseenter", load);
    // touch devices: load on first tap so the gameplay frame can be seen
    card.addEventListener("touchstart", load, { passive: true });
  });

  /* ---- hexark video: ensure it autoplays when in view (mobile safari) ---- */
  var hexVid = document.getElementById("hexark-video");
  if (hexVid) {
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) hexVid.play().catch(function () {});
        else hexVid.pause();
      });
    }, { threshold: 0.4 });
    hio.observe(hexVid);
  }

  /* ---- cross-deck path switcher (only on decks with data-here: studios/engine) ---- */
  (function () {
    var here = (document.body.getAttribute("data-here") || "").toLowerCase();
    if (!here) return;
    var nav = document.createElement("nav");
    nav.className = "deckswitch";
    nav.setAttribute("aria-label", "Switch company");
    nav.innerHTML =
      '<a class="ds-home" href="/v4/" aria-label="Back to chooser" title="Separate companies · separate raises"><img src="assets/brand/star.png" alt="AIGO" /></a>'
      + '<a class="ds-seg" data-deck="studios" href="/v4/studios/">Studios</a>'
      + '<a class="ds-seg" data-deck="engine" href="/v4/engine/">Engine</a>';
    document.body.appendChild(nav);
    Array.prototype.slice.call(nav.querySelectorAll(".ds-seg")).forEach(function (a) {
      if (a.getAttribute("data-deck") === here) a.setAttribute("aria-current", "page");
    });
  })();
})();
