export class BouncingLogoContainer {
  constructor(containerElement, iconSources) {
    this.container = containerElement;
    this.icons = iconSources.map((source, index) =>
      this.createIcon(source, index),
    );
    this.isAnimating = false;
  }

  createIcon(source, index) {
    const element = document.createElement("img");
    element.src = source;
    element.className = "bouncing-icon";
    element.style.position = "absolute";
    element.style.width = "60px";
    element.style.height = "60px";
    element.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,0.2))";
    element.style.userSelect = "none";
    this.container.appendChild(element);

    const randomPosX = Math.random() * (window.innerWidth - 60);
    const randomPosY = Math.random() * (window.innerHeight - 60);
    const baseVelocity = 1.5 + Math.random();
    const velocityX = (index % 2 === 0 ? 1 : -1) * baseVelocity;
    const velocityY = (index % 3 === 0 ? 1 : -1) * baseVelocity;

    return {
      element,
      posX: randomPosX,
      posY: randomPosY,
      velX: velocityX,
      velY: velocityY,
    };
  }

  updatePositions() {
    if (!this.isAnimating) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const iconSize = 60;

    this.icons.forEach((icon) => {
      icon.posX += icon.velX;
      icon.posY += icon.velY;

      const hitLeftWall = icon.posX <= 0;
      const hitRightWall = icon.posX + iconSize >= viewportWidth;
      if (hitLeftWall || hitRightWall) icon.velX *= -1;

      const hitTopWall = icon.posY <= 0;
      const hitBottomWall = icon.posY + iconSize >= viewportHeight;
      if (hitTopWall || hitBottomWall) icon.velY *= -1;

      icon.posX = Math.max(0, Math.min(icon.posX, viewportWidth - iconSize));
      icon.posY = Math.max(0, Math.min(icon.posY, viewportHeight - iconSize));

      icon.element.style.transform = `translate(${icon.posX}px, ${icon.posY}px)`;
    });

    requestAnimationFrame(() => this.updatePositions());
  }

  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.container.style.opacity = "1";
    this.container.style.zIndex = "-1";
    this.updatePositions();
  }

  stop() {
    this.isAnimating = false;
    this.container.style.opacity = "0";
    this.container.style.zIndex = "-10";
  }
}
