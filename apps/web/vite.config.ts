import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        host: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', 'lucide-react'],
                    tanstack: ['@tanstack/react-query', '@tanstack/react-table', '@tanstack/react-router'],
                    recharts: ['recharts']
                }
            }
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
    }
});
