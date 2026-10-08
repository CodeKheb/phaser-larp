import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// contributors/CONTRIBUTORS.txt lives outside the Vite root (websight/),
// so it gets an alias and is imported with ?raw (inlined into the bundle).
const contributorsFile = fileURLToPath(
    new URL('../contributors/CONTRIBUTORS.txt', import.meta.url),
);
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
    base: '/phaser-larp/',
    resolve: {
        // Regex so `@contributors?raw` keeps its query string while the
        // specifier itself is rewritten to the file outside the root.
        alias: [
            {
                find: /^@contributors(\?.*)?$/,
                replacement: contributorsFile + '$1',
            },
        ],
    },
    server: {
        // The contributors file sits outside the project root; allow the
        // repo root so the dev server can serve it (build needs no config).
        fs: {
            allow: [repoRoot],
        },
    },
});
