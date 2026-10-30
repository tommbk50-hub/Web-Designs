# vendor/

Self-hosted third-party scripts used by `index.html`.

- `model-viewer.min.js` — [@google/model-viewer](https://github.com/google/model-viewer) v3.4.0,
  licensed under Apache-2.0. Bundled locally so the Section 2 "3D Treatments &amp; Materials"
  viewer still loads if the `cdn.jsdelivr.net` CDN is blocked or unreachable (e.g. restrictive
  clinic/office networks). `index.html` tries this local copy first and falls back to the CDN
  only if it is missing.
