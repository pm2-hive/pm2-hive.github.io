(function () {
  "use strict";

  const config = window.MIXPANEL_CONFIG || {};

  const debugLog = function () {
    if (config.debug) {
      console.log.apply(console, arguments);
    }
  };

  if (!config.token || config.token === "YOUR_MIXPANEL_TOKEN_HERE") {
    debugLog("[Mixpanel] No valid token configured. Tracking disabled.");
    return;
  }

  let mixpanelInitialized = false;

  function initializeMixpanel() {
    if (mixpanelInitialized) {
      debugLog("[Mixpanel] Already initialized, skipping...");
      return;
    }

    const isEUUser = window.GEO_DETECTION && window.GEO_DETECTION.isEU;
    const shouldIgnoreDNT = !isEUUser || config.ignore_dnt;

    // 👉 Config Mixpanel avec autocapture activé
    const mixpanelConfig = {
      token: config.token.substring(0, 8) + "...",
      debug: config.debug || false,
      api_host: config.api_host || "default",

      // si tu veux respecter DNT pour l’UE, tu peux brancher shouldIgnoreDNT
      ignore_dnt: shouldIgnoreDNT,

      track_pageview: false, // on laisse autocapture gérer les pages
      persistence: "cookie",

      autocapture: {
        pageview: "full-url", // <--- active l'auto page tracking
        click: false,
        dead_click: false,
        input: true,
        rage_click: false,
        scroll: false,
        submit: true,
        capture_text_content: false,
      },
    };

    if (config.api_host) {
      mixpanelConfig.api_host = config.api_host;
    }

    mixpanel.init(config.token, mixpanelConfig);
    mixpanelInitialized = true;

    debugLog("[Mixpanel] Initialized with autocapture config", mixpanelConfig);

    // Si tu veux garder le tracking cross-site, on l'active après init
    setupCrossSiteTracking();
  }

  // Gestion consentement
  window.addEventListener("analytics-consent-granted", function () {
    debugLog("[Mixpanel] Analytics consent granted - initializing Mixpanel");
    initializeMixpanel();
  });

  window.addEventListener("analytics-consent-rejected", function () {
    debugLog("[Mixpanel] Analytics consent rejected - opting out of tracking");
    if (mixpanel && typeof mixpanel.opt_out_tracking === "function") {
      mixpanel.opt_out_tracking();
    }
  });

  function checkConsentAndInit() {
    if (!window.GEO_DETECTION || !window.GEO_DETECTION.detected) {
      debugLog("[Mixpanel] Waiting for geo-detection to complete...");
      window.addEventListener("geo-detection-complete", checkConsentAndInit, {
        once: true,
      });
      return;
    }

    if (window.ANALYTICS_CONSENT_GIVEN === true) {
      debugLog(
        "[Mixpanel] Pre-existing consent found - initializing immediately"
      );
      initializeMixpanel();
    } else {
      debugLog("[Mixpanel] Waiting for user consent...");
    }
  }

  if (window.CONSENT_READY) {
    checkConsentAndInit();
  } else {
    window.addEventListener("consent-manager-ready", checkConsentAndInit);
  }

  // ❌ Plus besoin de trackCurrentPage si tu utilises autocapture.pageview
  // function trackCurrentPage() { ... }

  function setupCrossSiteTracking() {
    if (!mixpanelInitialized) {
      debugLog(
        "[Mixpanel] Cross-site tracking setup called before init - skipping."
      );
      return;
    }

    const distinctId = mixpanel.get_distinct_id();

    document.querySelectorAll("a[data-track-cross-site]").forEach((link) => {
      try {
        const url = new URL(link.href);
        url.searchParams.set("mpid", distinctId);
        link.href = url.toString();

        debugLog("[Mixpanel] 🔗 Cross-site link prepared:", link.href);
      } catch (err) {
        debugLog("[Mixpanel] ⚠️  Invalid link:", link.href);
      }
    });

    document.addEventListener("click", function (e) {
      const link = e.target.closest("a[data-track-cross-site]");
      if (!link) return;

      const trackingEvent =
        link.getAttribute("data-tracking-event") || "cross_site_link_clicked";

      mixpanel.track(trackingEvent, {
        device_id: distinctId,
        destination_url: link.href,
        link_text: link.textContent.trim(),
      });

      debugLog("[Mixpanel] 🔗 Cross-site link clicked:", trackingEvent);
    });

    debugLog(
      "[Mixpanel] 🔗 Cross-site tracking enabled for",
      document.querySelectorAll("a[data-track-cross-site]").length,
      "links"
    );
  }

  if (config.debug) {
    window.mp = mixpanel;
    debugLog("[Mixpanel] 💡 Debug mode: Access mixpanel via window.mp");
  }
})();
