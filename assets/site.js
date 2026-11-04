"use strict";

// Click a photo to show it (almost) full screen; click again, or press Esc, to go back (as zoomPhoto() in randomcurve.com's site.js).
// With `photos` ({ src, alt, video } list) and the index of the clicked one, ‹ › buttons and the arrow keys step through them,
// wrapping around; videos play with their controls
function zoomPhoto(img, photos = [img], index = 0) {
  const overlay = Object.assign(document.createElement("div"), { className: "zoom-overlay" });
  let big;
  const show = (i) => {
    index = (i + photos.length) % photos.length;
    const item = photos[index];
    const next = item.video
      ? Object.assign(document.createElement("video"), { src: item.src, controls: true, autoplay: true, playsInline: true, title: item.alt })
      : Object.assign(document.createElement("img"), { src: item.src.split("#")[0], alt: item.alt });
    // Using the video's controls must not close the overlay
    if (item.video) next.onclick = (ev) => ev.stopPropagation();
    if (big) big.replaceWith(next);
    else overlay.prepend(next);
    big = next;
  };
  show(index);
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
