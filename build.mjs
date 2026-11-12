import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const logosDir = new URL('./images/logos/', import.meta.url);
const files = (await readdir(logosDir, { withFileTypes: true }))
  .filter(entry => entry.isFile() && /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name))
  .map(entry => entry.name)
  .sort();
const license = await readFile(new URL('./LogoLoop.LICENSE.md', import.meta.url), 'utf8');
const notice = `/*! React Bits LogoLoop (https://reactbits.dev)\n${license}*/`;

await build({
  entryPoints: [fileURLToPath(new URL('./hero-gradient.jsx', import.meta.url))],
  bundle: true,
  minify: true,
  outfile: fileURLToPath(new URL('./vendor/hero-gradient.js', import.meta.url)),
  banner: { js: notice, css: notice },
  plugins: [{
    name: 'award-logos',
    setup(plugin) {
      plugin.onResolve({ filter: /^award-logos$/ }, () => ({ path: 'award-logos', namespace: 'award-logos' }));
      plugin.onLoad({ filter: /.*/, namespace: 'award-logos' }, () => ({
        contents: `export default ${JSON.stringify(files.map(name => ({
          src: `./images/logos/${encodeURIComponent(name)}`,
          alt: name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
        })))};`,
        loader: 'js'
      }));
    }
  }]
});
