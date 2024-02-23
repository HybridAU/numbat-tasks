// This is a false positive, vite is listed as a dev dependency
// and eslint would like it to be a core dependency because we
// are importing it here.
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: 'src',
      },
    ],
    extensions: ['.ts', '.tsx'],
  },
});
