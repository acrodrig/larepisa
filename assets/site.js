"use strict";

// Click a photo to show it (almost) full screen; click again, or press Esc, to go back (as zoomPhoto() in randomcurve.com's site.js)
function zoomPhoto(img) {
  const overlay = Object.assign(document.createElement("div"), { className: "zoom-overlay" });
  overlay.append(Object.assign(document.createElement("img"), { src: img.src.split("#")[0], alt: img.alt }));
  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (ev) => { if (ev.key === "Escape") close(); };
  overlay.onclick = close;
  document.addEventListener("keydown", onKey);
  document.body.append(overlay);
}
