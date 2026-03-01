import { setupTabSwitching } from "./modules/tabs.js";
import { setupShootingStars } from "./modules/animations.js";
import { setupTimeSimulator, updatePSTTimeDisplay } from "./modules/time.js";
import { BouncingLogoContainer } from "./modules/bouncer.js";
import { setupUnreliableImages } from "./modules/analytics.js";

const BOUNCING_LOGO_ICONS = [
  "assets/icons/github.svg",
  "assets/icons/linkedin.svg",
  "assets/icons/leetcode.svg",
  "assets/icons/codewars.svg",
  "assets/icons/monkeytype.svg",
  "assets/icons/python.svg",
  "assets/icons/java.svg",
  "assets/icons/lua.svg",
  "assets/icons/powershell.svg",
  "assets/icons/js.svg",
  "assets/icons/ts.svg",
  "assets/icons/html.svg",
  "assets/icons/css.svg",
  "assets/icons/c.svg",
  "assets/icons/cpp.svg",
];

document.addEventListener("DOMContentLoaded", () => {
  function initializeUI() {
    setupTabSwitching();
    setupShootingStars();
    setupTimeSimulator();
    initializeBouncingLogos();
    startPSTTimeUpdateInterval();
    setupUnreliableImages();
  }

  function initializeBouncingLogos() {
    const bouncingLogoContainer = document.getElementById(
      "bouncing-logo-container",
    );
    if (!bouncingLogoContainer) return;

    window.bouncingLogoInstance = new BouncingLogoContainer(
      bouncingLogoContainer,
      BOUNCING_LOGO_ICONS,
    );
  }

  function startPSTTimeUpdateInterval() {
    setInterval(updatePSTTimeDisplay, 30000);
  }

  initializeUI();
});
