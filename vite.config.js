import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3666,
        proxy: {
            "/teambuilder": {
                target: "http://localhost:4173",
                changeOrigin: true,
                // configure: (proxy) => {
                //     proxy.on('proxyRes', (proxyRes, req, res) => {
                //         // Prevent redirects from being followed
                //         if (proxyRes.headers.location) {
                //             // Strip the target origin from the redirect if it exists
                //             proxyRes.headers.location = proxyRes.headers.location.replace('http://localhost:4179', '');

                //             // Ensure redirects stay within the /teambuilder path
                //             if (!proxyRes.headers.location.startsWith('/teambuilder')) {
                //                 proxyRes.headers.location = '/teambuilder' + proxyRes.headers.location;
                //             }
                //         }
                //     });
                // }
            }
        }
    },
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
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                game: "game.html"
            }
        }
    },
    esbuild: {
        legalComments: "none"
    }
});
