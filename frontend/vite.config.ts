import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

const cesiumRoot = normalizePath(path.resolve(__dirname, '../node_modules/cesium/Build/Cesium'));

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: `${cesiumRoot}/Workers/**/*`, dest: 'cesium/Workers' },
        { src: `${cesiumRoot}/ThirdParty/**/*`, dest: 'cesium/ThirdParty' },
        { src: `${cesiumRoot}/Assets/**/*`, dest: 'cesium/Assets' },
        { src: `${cesiumRoot}/Widgets/**/*`, dest: 'cesium/Widgets' },
      ],
    }),
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
