/* Minimal stand-in for Google Studio Enabler so this GWD creative runs
   self-hosted (clicks are handled by the page that embeds the iframe). */
(function () {
  "use strict";

  var listeners = {};

  window.Enabler = {
    isInitialized: function () { return true; },
    isPageLoaded: function () { return true; },
    isVisible: function () { return true; },
    isServingInLiveEnvironment: function () { return false; },
    addEventListener: function (type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
      setTimeout(function () { fn({ type: type }); }, 0);
    },
    removeEventListener: function (type, fn) {
      var l = listeners[type] || [];
      var i = l.indexOf(fn);
      if (i !== -1) l.splice(i, 1);
    },
    exit: function () {},
    exitOverride: function () {},
    reportManualClose: function () {},
    loadModule: function (module, cb) { if (cb) setTimeout(cb, 0); },
    loadScript: function (url, cb) { if (cb) setTimeout(cb, 0); },
    setDevDynamicContent: function () {},
    getUrl: function (url) { return url; },
    getParameter: function () { return ""; },
    counter: function () {},
    startTimer: function () {},
    stopTimer: function () {},
    getDartAdId: function () { return 0; },
    getDartCreativeId: function () { return 0; }
  };

  /* Any Enabler method this stub doesn't define becomes a safe no-op. */
  if (typeof Proxy === "function") {
    window.Enabler = new Proxy(window.Enabler, {
      get: function (target, prop) {
        if (prop in target) return target[prop];
        return function () {};
      }
    });
  }

  window.studio = window.studio || {};
  window.studio.events = window.studio.events || {
    StudioEvent: {
      INIT: "init",
      PAGE_LOADED: "pageloaded",
      VISIBLE: "visible",
      HIDDEN: "hidden",
      EXIT: "exit",
      INTERACTION: "interaction",
      ORIENTATION: "orientation"
    }
  };
})();
