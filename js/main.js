/* No Cost Shoes — shared behavior */

(function () {
  "use strict";

  /* Signal JS availability — reveal animations only apply when this class is set */
  document.documentElement.classList.add("js");

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Products dropdown: click/tap toggle (hover works via CSS) */
  document.querySelectorAll(".nav__item").forEach(function (item) {
    var btn = item.querySelector(".nav__drop-btn");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav__item.is-open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        var btn = item.querySelector(".nav__drop-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* Highlight current page in nav */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a[href]").forEach(function (a) {
    var target = a.getAttribute("href").split("#")[0];
    if (target === here) a.classList.add("is-active");
  });

  /* If a dropdown page is current, highlight the Products button too */
  document.querySelectorAll(".nav__item").forEach(function (item) {
    if (item.querySelector("a.is-active")) {
      var btn = item.querySelector(".nav__drop-btn");
      if (btn) btn.classList.add("is-active");
    }
  });

  /* Scroll-reveal */
  var revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealed.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 3D hero shoe viewer: pointer tilt + drag to step through angle photos */
  var viewer = document.querySelector("[data-shoe3d]");
  if (viewer) {
    var stage = viewer.querySelector(".shoe3d__stage");
    var frames = viewer.querySelectorAll(".shoe3d__img");
    var dots = viewer.querySelectorAll(".shoe3d__dots button");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = 0;
    var dragging = false;
    var startX = 0;
    var startFrame = 0;

    frames.forEach(function (f, i) {
      if (f.classList.contains("is-active")) current = i;
    });

    var show = function (i) {
      current = ((i % frames.length) + frames.length) % frames.length;
      frames.forEach(function (f, j) { f.classList.toggle("is-active", j === current); });
      dots.forEach(function (d, j) { d.classList.toggle("is-active", j === current); });
    };

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { show(i); });
    });

    viewer.addEventListener("pointerdown", function (e) {
      if (e.target.tagName === "BUTTON") return;
      dragging = true;
      startX = e.clientX;
      startFrame = current;
      viewer.classList.add("is-grabbing");
      viewer.setPointerCapture(e.pointerId);
    });

    viewer.addEventListener("pointermove", function (e) {
      if (dragging) {
        show(startFrame + Math.round((e.clientX - startX) / 70));
      } else if (!reduceMotion && e.pointerType === "mouse") {
        var r = viewer.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.transform = "rotateY(" + (x * 18).toFixed(1) + "deg) rotateX(" + (-y * 12).toFixed(1) + "deg)";
      }
    });

    ["pointerup", "pointercancel"].forEach(function (ev) {
      viewer.addEventListener(ev, function () {
        dragging = false;
        viewer.classList.remove("is-grabbing");
      });
    });

    viewer.addEventListener("pointerleave", function () {
      stage.style.transform = "";
    });
  }

  /* Cookie / tracking consent (Google Consent Mode v2) — ported from
     quantummedicalsupply.com. Tracking stays denied until the visitor
     accepts; declining keeps analytics/ad storage off. */
  (function () {
    var KEY = "ncs-consent";
    function gtagSafe() {
      if (typeof window.gtag === "function") { window.gtag.apply(window, arguments); }
    }
    function applyConsent(state) {
      var v = state === "granted" ? "granted" : "denied";
      gtagSafe("consent", "update", {
        "ad_storage": v, "ad_user_data": v, "ad_personalization": v, "analytics_storage": v
      });
    }
    function store(state) { try { localStorage.setItem(KEY, state); } catch (e) {} }
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

    var banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<div class="cookie-consent__inner">' +
        '<p class="cookie-consent__text">We use cookies and similar technologies to analyze site traffic and improve your experience. ' +
        'You can accept or decline analytics and advertising tracking — essential cookies are always on. ' +
        'See our <a href="privacy.html">Privacy Policy</a>.</p>' +
        '<div class="cookie-consent__actions">' +
          '<button type="button" class="btn btn--ghost cookie-decline">Decline</button>' +
          '<button type="button" class="btn btn--primary cookie-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    function hide() { banner.classList.remove("is-open"); }
    function show() { banner.classList.add("is-open"); }

    banner.querySelector(".cookie-accept").addEventListener("click", function () {
      store("granted"); applyConsent("granted"); hide();
    });
    banner.querySelector(".cookie-decline").addEventListener("click", function () {
      store("denied"); applyConsent("denied"); hide();
    });

    /* Show the banner only until the visitor has made a choice */
    if (!read()) { show(); }

    /* Let visitors reopen the banner to change their mind (consent withdrawal) */
    function wireReopen(el) {
      el.addEventListener("click", function (e) { e.preventDefault(); show(); });
    }
    document.querySelectorAll("[data-cookie-settings]").forEach(wireReopen);
    document.querySelectorAll(".footer-legal").forEach(function (legal) {
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = "Cookie Preferences";
      a.setAttribute("data-cookie-settings", "");
      wireReopen(a);
      legal.appendChild(a);
    });
  })();

  /* Forms compose an email in the visitor's own mail app (static site, no
     backend). data-mailto-form holds the recipient; every filled field is
     copied into the body. Swap this for a real endpoint (Formspree, Zapier
     webhook, CRM) when one is available. */
  document.querySelectorAll("form[data-mailto-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var lines = [];
      new FormData(form).forEach(function (value, key) {
        if (String(value).trim() === "") return;
        /* humanize the field name: "firstName" -> "First Name" */
        var label = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, function (c) { return c.toUpperCase(); });
        lines.push(label + ": " + value);
      });
      var body = lines.join("\n");
      var intro = form.getAttribute("data-body-intro");
      var outro = form.getAttribute("data-body-outro");
      if (intro) body = intro + "\n\n" + body;
      if (outro) body = body + "\n\n" + outro;
      var href = "mailto:" + form.getAttribute("data-mailto-form") +
        "?subject=" + encodeURIComponent(form.getAttribute("data-subject") || "Website form") +
        "&body=" + encodeURIComponent(body);
      var success = form.parentElement.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      window.location.href = href;
    });
  });
})();
