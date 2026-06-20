import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import compression from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react({
      // Improve bundle size by excluding unnecessary React features in production
      babel: {
        plugins: [
          ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]
        ]
      }
    }),
    compression({ 
      threshold: 0, // Compress all assets
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({ 
      threshold: 0,
      algorithm: 'brotliCompress',
      ext: '.br', 
    })
  ],
  base: './', // Ensures relative paths for assets
  build: {
    outDir: './dist', // Default output directory
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          charts: ['recharts'],
          // Split components to reduce main bundle size
          layout: ['./src/components/NavBar.jsx', './src/components/Footer.jsx'],
          analytics: ['./src/components/Analytics.jsx', './src/components/DashboardStats.jsx'],
          features: ['./src/components/FeatureShowCase.jsx'],
          leads: ['./src/components/LeadGeneration.jsx']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        },
      },
    },
    assetsInlineLimit: 4096, // 4kb - smaller assets will be inlined
    cssCodeSplit: true,
    cssMinify: true,
  },
  server: {
    open: true, // Opens the browser on local development
    host: true, // Ensures server is accessible over the network
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  // Add optimization for faster builds
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'mixpanel-browser'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true
  }
});
