import fs from 'node:fs';
import path from 'node:path';
import {defineConfig, type Plugin} from 'vite';

const STATIC_FILES = [
  'index.html',
  'decision.html',
  'payments.html',
  'reference.html',
  'style.css',
  'data.js',
  'app.js',
  'README.txt',
  'assets/graduate-champaign-logo.png',
];

function staticMultiPageExport(): Plugin {
  return {
    name: 'static-multipage-export',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      fs.rmSync(distDir, {recursive: true, force: true});
      fs.mkdirSync(distDir, {recursive: true});
      for (const file of STATIC_FILES) {
        const src = path.resolve(__dirname, file);
        const dest = path.resolve(distDir, file);
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dest), {recursive: true});
          fs.copyFileSync(src, dest);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    publicDir: false as const,
    plugins: [staticMultiPageExport()],
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
