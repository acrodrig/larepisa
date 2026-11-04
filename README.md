# La Repisa

The family photo albums at https://larepisa.com: `index.html` lists the albums by year and `album.html?YYYY/YYYY-MM-Name`
shows one. Plain HTML served by GitHub Pages, no build.

The photos, album JSON and `overrides.json` (👎, covers, ❤️) come from the same bucket as randomcurve.com, and sign-in and
votes go to the same Cloud Function (`photos-signin`), so both sites show the same albums. The pages, `assets/signin.js` and
the photo styles are copies of randomcurve.com's (repo `acrodrig/acrodrig.github.io`); port fixes by hand.

`https://larepisa.com` must stay allowed in the function's `ORIGINS`, the bucket's CORS rule and the Google OAuth client's
JavaScript origins. Try it locally with `python3 -m http.server 4000` (an origin already allowed for randomcurve.com).
