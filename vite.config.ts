import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/asrama-alfi-dua/',  // ← nama repo kamu
})
