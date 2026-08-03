import { build } from 'vite';
import path from 'path';

const __dirname = import.meta.dirname;

async function runBuild() {
  console.log('Building popup and sidepanel HTML assets...');
  // 1. Build frontend pages (popup, sidepanel)
  await build({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, 'index.html'),
          sidepanel: path.resolve(__dirname, 'sidepanel.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        }
      },
    },
  });

  console.log('Building background service worker (isolated)...');
  // 2. Build background service worker (isolated, no code splitting)
  await build({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          background: path.resolve(__dirname, 'src/background.ts'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          codeSplitting: false,
        },
      },
    },
  });

  console.log('Building content script (isolated)...');
  // 3. Build content script (isolated, no code splitting)
  await build({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          content: path.resolve(__dirname, 'src/content.ts'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          codeSplitting: false,
        },
      },
    },
  });
  
  console.log('Build completed successfully.');
}

runBuild().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
