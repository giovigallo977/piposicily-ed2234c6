import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerPWAUpdater, registerVisibilityUpdater } from "./pwa-updater";

// Register PWA auto-update handlers
registerPWAUpdater();
registerVisibilityUpdater();

createRoot(document.getElementById("root")!).render(<App />);
