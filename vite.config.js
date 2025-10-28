import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'VueSafeguard',
      fileName: (format) =>
        format === 'es'
          ? 'vue-safeguard.es.js'
          : 'vue-safeguard.umd.cjs',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {vue: 'Vue'}
      }
    }
  }
});