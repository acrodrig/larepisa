// Google sign-in gate for the photo pages: anyone with a Google account gets in, and functions/signin records who.
// The function also returns a session (kept in localStorage) that sendSigned() uses to log who voted on a photo or chose a cover.
// shortcut: this only hides the pages; photos and album JSON stay public in the bucket for anyone with a direct link
const GOOGLE_CLIENT_ID = "695205932000-b0q6ubajsan9pj8qq823b0a5cvcm6pug.apps.googleusercontent.com";
const SIGNIN_URL = "https://us-central1-randomcurve.cloudfunctions.net/photos-signin";
const SIGNIN_DAYS = 7; // a browser signs in (and is recorded) again after this many days

// Shows the Google button after `after` until the visitor signs in, then calls `show`
function signInThen(after, show) {
  // Browsers signed in before sessions existed have no session yet, so they sign in once more
  if (Date.now() < Number(localStorage.photosSignedInUntil) && localStorage.photosSession) return show();
  const box = Object.assign(document.createElement("div"), { className: "signin" });
  box.innerHTML = "<p>Please sign in with your Google account to see the photos.</p><div></div>";
  after.after(box);

  const script = Object.assign(document.createElement("script"), { src: "https://accounts.google.com/gsi/client", async: true });
  script.onload = () => {
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, auto_select: true, callback: ({ credential }) => record(credential, box, show) });
    google.accounts.id.renderButton(box.lastChild, { theme: "outline", size: "large", text: "signin_with" });
    google.accounts.id.prompt();
  };
  document.head.append(script);
}

async function record(credential, box, show) {
  const res = await fetch(SIGNIN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential, page: location.pathname + location.search }) }).catch(() => undefined);
  if (!res?.ok) return box.firstChild.textContent = "Sign-in could not be completed, please try again later.";
  localStorage.photosSession = (await res.json()).session;
  localStorage.photosSignedInUntil = Date.now() + SIGNIN_DAYS * 864e5;
  box.remove();
  show();
}

// Sends `fields` with the session to functions/signin: { photo, vote } (thumbs "up" or "down" on a photo path from the
// album JSON), { album, cover, thumb } (a new album cover) or { photo, favorite, thumb, width, height, date } (❤️ on or off);
// true when it was recorded
async function sendSigned(fields) {
  const res = await fetch(SIGNIN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session: localStorage.photosSession, ...fields }) }).catch(() => undefined);
  // An expired or unknown session: sign in again on the next page load
  if (res?.status === 401) localStorage.removeItem("photosSignedInUntil");
  return Boolean(res?.ok);
}

// Photos voted 👎 (a Set of NFC paths), covers chosen on the site and ❤️ photos (by NFC path), kept in the bucket by
// functions/signin (see OVERRIDES there); empty when unavailable
async function loadOverrides(photos) {
  const res = await fetch(photos + "overrides.json", { cache: "no-cache" }).catch(() => undefined);
  const { excluded = [], covers = {}, favorites = {} } = res?.ok ? await res.json() : {};
  return { excluded: new Set(excluded), covers, favorites };
}

// A year's ❤️ photos that are not 👎, oldest first, as album JSON photos
function yearFavorites({ excluded, favorites }, year) {
  return Object.entries(favorites).filter(([path]) => path.startsWith(`${year}/`) && !excluded.has(path)).map(([, photo]) => photo)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "") || a.filename.localeCompare(b.filename));
}
