import { setupTabSwitching } from "./modules/tabs.js";
import { setupShootingStars } from "./modules/animations.js";
import { setupTimeSimulator, updatePSTTimeDisplay } from "./modules/time.js";
import { BouncingLogoContainer } from "./modules/bouncer.js";
import { setupUnreliableImages } from "./modules/analytics.js";

document.addEventListener("DOMContentLoaded", () => {
  const BOUNCING_LOGO_CONTAINER_ID = "bouncing-logo-container";
  const MILLISECONDS_BETWEEN_TIME_UPDATES = 30000;

  function initializeApplication() {
    setupTabSwitching();
    setupShootingStars();
    setupTimeSimulator();
    setupBackgroundSkillAnimation();
    schedulePSTTimeUpdates();
    setupUnreliableImages();
  }

  function setupBackgroundSkillAnimation() {
    const animationContainer = document.getElementById(
      BOUNCING_LOGO_CONTAINER_ID,
    );
    if (!animationContainer) return;

    const skillIconPaths = gatherLocalSkillIconPaths();
    if (hasNoAvailableIcons(skillIconPaths)) return;

    initializeBouncingIconSystem(animationContainer, skillIconPaths);
  }

  function gatherLocalSkillIconPaths() {
    return Array.from(document.querySelectorAll(".skills-grid img"))
      .map((iconElement) => iconElement.src.replace("-shield.svg", "-logo.svg"))
      .filter(isLocalAssetPath);
  }

  function isLocalAssetPath(sourceUrl) {
    const LOCAL_ICON_PATH_IDENTIFIER = "/assets/icons/";
    return sourceUrl.includes(LOCAL_ICON_PATH_IDENTIFIER);
  }

  function hasNoAvailableIcons(iconPaths) {
    return iconPaths.length === 0;
  }

  function initializeBouncingIconSystem(container, icons) {
    window.bouncingLogoInstance = new BouncingLogoContainer(container, icons);
  }

  function schedulePSTTimeUpdates() {
    setInterval(updatePSTTimeDisplay, MILLISECONDS_BETWEEN_TIME_UPDATES);
  }

  initializeApplication();
});
