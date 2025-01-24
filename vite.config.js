import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3666
    },
    base: "/",
    middlewareMode: true,
    plugins: [{
        name: 'custom-path-rewrite',
        configureServer(server) {
        server.middlewares.use((req, res, next) => {
            const url = req.url;
            if (url.startsWith('/game/')) {
            req.url = '/game.html'; // Rewrite the request to game.html
            }
            next();
        });
        },
    },
    ],
});
