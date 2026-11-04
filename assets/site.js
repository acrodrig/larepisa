"use strict";

// Click a photo to show it (almost) full screen; click again, or press Esc, to go back (as zoomPhoto() in randomcurve.com's site.js).
// With `photos` ({ src, alt } list) and the index of the clicked one, ‹ › buttons and the arrow keys step through them, wrapping around
function zoomPhoto(img, photos = [img], index = 0) {
  const overlay = Object.assign(document.createElement("div"), { className: "zoom-overlay" });
  const big = document.createElement("img");
  const show = (i) => {
    index = (i + photos.length) % photos.length;
    Object.assign(big, { src: photos[index].src.split("#")[0], alt: photos[index].alt });
  };
  show(index);
  overlay.append(big);
  if (photos.length > 1) {
    for (const [step, label, name] of [[-1, "‹", "Previous photo"], [1, "›", "Next photo"]]) {
      const button = Object.assign(document.createElement("button"), { type: "button", className: step < 0 ? "zoom-prev" : "zoom-next", textContent: label, title: name });
      button.setAttribute("aria-label", name);
      button.onclick = (ev) => {
        ev.stopPropagation();
        show(index + step);
      };
      overlay.append(button);
    }
  }
  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (ev) => {
    if (ev.key === "Escape") close();
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") show(index + (ev.key === "ArrowLeft" ? -1 : 1));
  };
  overlay.onclick = close;
  document.addEventListener("keydown", onKey);
  document.body.append(overlay);
}
