import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite desplegar en cualquier ruta (p. ej. GitHub Pages)
export default defineConfig({ base: './', plugins: [react()] })
