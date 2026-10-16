import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps the built site working from any folder or subpath.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rolldownOptions: {
      output: {
        // Separate files for the big libraries so browsers can cache them between updates.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap|lenis)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ }
          ]
        }
      }
    }
  }
});
