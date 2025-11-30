import { defineConfig } from 'vite'
import  { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
          manifest: true,
          outDir: 'dist',
          emptyOutDir: true,
          rollupOptions: {
              input: {
                  main: resolve(__dirname, 'src/main.js'),
                  style: resolve(__dirname, 'src/style.css'),
                  flowbite: resolve(__dirname, 'node_modules/flowbite/dist/flowbite.min.js')
              },
              output: {
                  entryFileNames: 'assets/main.js',
                  assetFileNames: 'assets/style.css',
              },
          },
      },
})