import {
  getCurrentTimeTheme,
  updatePSTTimeDisplay,
  formatTimeDisplay,
  getPSTTime,
  isSimulating,
  resetSimulation,
} from "./time.js";

export function setupTabSwitching() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  function deactivateAllTabs() {
    tabButtons.forEach((button) => {
      button.classList.remove("active-tab");
      button.setAttribute("aria-selected", "false");
    });
    tabContents.forEach((content) => content.classList.remove("active-panel"));
  }

  function activateTab(button) {
    button.classList.add("active-tab");
    button.setAttribute("aria-selected", "true");
  }

  function updatePageTheme(targetId) {
    if (targetId !== "profiles-panel") {
      resetSimulation();
    }

    const THEME_CLASSES = [
      "bg-background",
      "bg-skills",
      "bg-sunny",
      "bg-evening",
      "bg-dark",
    ];
    document.body.classList.remove(...THEME_CLASSES);

    if (targetId === "background-panel") {
      document.body.classList.add("bg-background");
    } else if (targetId === "skills-projects-panel") {
      document.body.classList.add("bg-skills");
    } else if (targetId === "profiles-panel") {
      document.body.classList.add(getCurrentTimeTheme());
      updatePSTTimeDisplay();
      syncTimeSimulatorToRealTime();
    }
  }

  function syncTimeSimulatorToRealTime() {
    if (typeof isSimulating !== "undefined" && !isSimulating) {
      const slider = document.getElementById("time-slider");
      const sliderDisplay = document.getElementById("slider-time-display");
      if (slider && sliderDisplay) {
        const { hour } = getPSTTime();
        slider.value = hour;
        sliderDisplay.textContent = formatTimeDisplay(hour);
      }
    }
  }

  function updateBouncingLogoState(targetId) {
    if (window.bouncingLogoInstance) {
      if (targetId === "skills-projects-panel") {
        window.bouncingLogoInstance.start();
      } else {
        window.bouncingLogoInstance.stop();
      }
    }
  }

  function switchTab(button) {
    const targetId = button.getAttribute("data-target");
    const targetPanel = document.getElementById(targetId);

    deactivateAllTabs();
    activateTab(button);

    if (targetPanel) {
      targetPanel.classList.add("active-panel");
    }

    updatePageTheme(targetId);
    updateBouncingLogoState(targetId);
  }

  document.body.classList.add("bg-background");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button));
  });
}
