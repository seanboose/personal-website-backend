import type { Plugin } from 'vite';

export function handleChromeDevtoolsRequest(): Plugin {
  return {
    name: 'vite-handle-chrome-devtools-request',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/.well-known/appspecific/com.chrome.devtools.json') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'No debug metadata available' }));
        } else {
          next();
        }
      });
    },
  };
}
