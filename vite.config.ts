import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const fullReloadAlways: PluginOption = {
  name: 'full-reload-always',
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
} as PluginOption

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    fullReloadAlways,
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@splinetool/react-spline', '@splinetool/runtime'],
          'vendor-ui': ['lucide-react', 'gsap'],
          'vendor-auth': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: true,
  },
  esbuild: {
    target: 'esnext'
  },
  optimizeDeps: {
    exclude: ['three'],
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})