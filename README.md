Website link: https://tommbk50-hub.github.io/Web-Designs/ 

Hazeglow renders behind the full page and responds to pointer movement while scrolling. The hero has a dark shade for white text; the rest of the page uses a translucent light surface for dark text. After editing `hero-gradient.jsx`, `service-gallery.jsx`, `AccordionGallery.jsx`, `BorderGlow.jsx`, `LogoLoop.jsx`, `award-logo-loop.jsx` or their CSS, run `npm install` and `npm run build` to update the bundled `vendor/hero-gradient.js` and `vendor/hero-gradient.css` used by the static page.

The award-logo animation at the top of the page uses image files in `images/logos/`. Add or remove PNG, JPG, SVG, WebP, AVIF or GIF files there, then run `npm run build` and commit the updated vendor bundle. Image filenames (without extensions, with hyphens/underscores replaced by spaces) become accessible descriptions. No logo names need to be maintained in the page markup.

The LogoLoop component is from [React Bits](https://reactbits.dev); its license is in `LogoLoop.LICENSE.md`.
The page also has a CSS gradient fallback in `index.html` for browsers where WebGL2 is unavailable.
Buttons and button-styled links play `sounds/buttons.mp3` when clicked.
