import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/test/",
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        icons: [
          {
            src: '/icons/stt_64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/icons/stt_144.png',
            sizes: '144x144',
            type: 'image/png'
          },
        ]
      }
    })
  ],
})
