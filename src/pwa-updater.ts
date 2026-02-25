// PWA Auto-Update Handler
// Ensures the PWA updates automatically and silently for all users

const UPDATE_INTERVAL_MS = 30 * 1000; // Check every 30 seconds

export const registerPWAUpdater = () => {
  if (!("serviceWorker" in navigator)) return;

  // When a new SW takes control, reload immediately to serve fresh content
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });

  // Periodic update check
  setInterval(async () => {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      await reg?.update();
    } catch {
      // Silently ignore network errors
    }
  }, UPDATE_INTERVAL_MS);

  // If a waiting SW exists on load, activate it right away
  navigator.serviceWorker.getRegistration().then(async (reg) => {
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    reg?.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      newWorker?.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          newWorker.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });

    // Force an immediate update check on app launch
    try { await reg?.update(); } catch {}
  });
};

// Check for updates when user returns to the app (tab focus or app resume)
export const registerVisibilityUpdater = () => {
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && "serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update();
      } catch {
        // Silently ignore
      }
    }
  });

  // Also check on window focus (covers desktop tab switching)
  window.addEventListener("focus", async () => {
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update();
      } catch {
        // Silently ignore
      }
    }
  });
};
