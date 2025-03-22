import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env, // Enables access to `process.env`
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set '@' as the alias for 'src'
    },
  }
})
