# La Repisa

The family photo albums at https://larepisa.com: `index.html` lists the albums by year and `album.html?YYYY/YYYY-MM-Name`
shows one. Plain HTML served by GitHub Pages, no build.

The photos, album JSON and `overrides.json` (👎, covers, ❤️) come from the same bucket as randomcurve.com, and sign-in and
votes go to the same Cloud Function (`photos-signin`), so both sites show the same albums. The pages, `assets/signin.js` and
the photo styles are copies of randomcurve.com's (repo `acrodrig/acrodrig.github.io`); port fixes by hand.

`https://larepisa.com` must stay allowed in the function's `ORIGINS`, the bucket's CORS rule and the Google OAuth client's
JavaScript origins. Try it locally with `python3 -m http.server 4000` (an origin already allowed for randomcurve.com).

## Hosting and DNS

- GitHub Pages serves the `main` branch of `acrodrig/larepisa` at the custom domain in `CNAME` (`larepisa.com`).
- The domain is registered through Route 53 Domains (registrar of record: Gandi) and its DNS is the Route 53 hosted zone
  `larepisa.com` (`Z009607825ICMF3N1RI14`, AWS account of randomcurve.com), with the name servers
  `ns-1254.awsdns-28.org`, `ns-857.awsdns-43.net`, `ns-1685.awsdns-18.co.uk` and `ns-129.awsdns-16.com`.
- Records: `larepisa.com` A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages),
  and `www.larepisa.com` CNAME `acrodrig.github.io`.
- Before 2026-11-04 the domain pointed at DreamHost and, earlier, GoDaddy name servers that no longer serve it (both answer
  REFUSED). Resolvers that cached that delegation (up to 48 hours) made GitHub report "DNS check unsuccessful
  (InvalidDNSError)" for a while after the switch; it cleared on its own.
- HTTPS: GitHub issues the certificate once its DNS check passes; then tick "Enforce HTTPS" in the repo's Pages settings.

```shell
dig NS larepisa.com @8.8.8.8          # the four awsdns servers
dig A larepisa.com @8.8.8.8           # the four 185.199.x.153 addresses
gh api repos/acrodrig/larepisa/pages --jq .https_certificate
```
