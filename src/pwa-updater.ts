// PWA Auto-Update Handler
// This module ensures the PWA updates automatically without user intervention

export const registerPWAUpdater = () => {
  if ("serviceWorker" in navigator) {
    // Listen for service worker updates
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // New service worker has taken control - reload to get new content
      window.location.reload();
    });

    // Check for updates periodically (every 60 seconds)
    setInterval(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    }, 60 * 1000);
  }
};

// Force update check on visibility change (when user returns to app)
export const registerVisibilityUpdater = () => {
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    }
  });
};
