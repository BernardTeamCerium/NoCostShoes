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

  /* Demo form handling: validate, then show confirmation.
     Wire the action attribute to a real endpoint when the backend is ready. */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.parentElement.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  });
})();
