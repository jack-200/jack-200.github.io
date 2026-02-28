export function setupUnreliableImages() {
  const unreliableImages = document.querySelectorAll(".unreliable-img");

  unreliableImages.forEach((img) => {
    img.addEventListener("error", () => {
      handleImageError(img);
    });

    if (img.complete && img.naturalHeight === 0) {
      handleImageError(img);
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
