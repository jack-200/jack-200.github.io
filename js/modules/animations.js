export function setupShootingStars() {
  const container = document.getElementById("shooting-stars-container");
  if (!container) return;

  const STAR_CONFIG = {
    TOP_START_PROBABILITY: 0.5,
    MAX_HORIZONTAL_VW: 100,
    MAX_TOP_HALF_VH: 50,
    MIN_DURATION: 1,
    DURATION_RANGE: 2,
    MIN_DELAY: 2000,
    DELAY_RANGE: 6000,
    START_TOP_OFFSET: -10,
    START_RIGHT_OFFSET: 110,
  };

  function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");

    const startingFromTop = Math.random() > STAR_CONFIG.TOP_START_PROBABILITY;

    if (startingFromTop) {
      const horizontalVw = Math.random() * STAR_CONFIG.MAX_HORIZONTAL_VW;
      star.style.left = `${horizontalVw}vw`;
      star.style.top = `${STAR_CONFIG.START_TOP_OFFSET}px`;
    } else {
      const verticalVh = Math.random() * STAR_CONFIG.MAX_TOP_HALF_VH;
      star.style.left = `${STAR_CONFIG.START_RIGHT_OFFSET}vw`;
      star.style.top = `${verticalVh}vh`;
    }

    const duration =
      Math.random() * STAR_CONFIG.DURATION_RANGE + STAR_CONFIG.MIN_DURATION;
    star.style.animationDuration = `${duration}s`;

    container.appendChild(star);
    setTimeout(() => star.remove(), duration * 1000);
  }

  function scheduleNextStar() {
    const delay =
      Math.random() * STAR_CONFIG.DELAY_RANGE + STAR_CONFIG.MIN_DELAY;
    setTimeout(() => {
      createShootingStar();
      scheduleNextStar();
    }, delay);
  }

  scheduleNextStar();
}
