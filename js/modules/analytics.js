export function setupUnreliableImages() {
  const unreliableImages = document.querySelectorAll(".unreliable-img");
  const isLocalhost =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  unreliableImages.forEach((img) => {
    if (isLocalhost) {
      handleImageError(img);
    } else {
      const realSrc = img.getAttribute("data-src");
      if (realSrc) {
        img.src = realSrc;
      }

      img.addEventListener("error", () => {
        handleImageError(img);
      });

      if (img.complete && img.naturalHeight === 0) {
        handleImageError(img);
      }
    }
  });

  function handleImageError(img) {
    const parent = img.parentElement;
    const fallbackText = img.getAttribute("data-fallback-text");

    if (fallbackText) {
      const fallbackDiv = document.createElement("div");
      fallbackDiv.className = "fallback-text";
      fallbackDiv.textContent = `// [ SERVICE_UNAVAILABLE: ${fallbackText} ]`;
      parent.replaceChild(fallbackDiv, img);
    } else {
      img.style.display = "none";
    }
  }
}
