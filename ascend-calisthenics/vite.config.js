import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages: if you deploy to https://<user>.github.io/<repo>/
// set base to '/<repo>/'. If you deploy to a custom domain or a user/org page
// (https://<user>.github.io/), leave base as '/'.
export default defineConfig({
  base: '/ascend-calisthenics/',
  plugins: [react()],
})
