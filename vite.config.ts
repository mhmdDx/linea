import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    assetsInclude: ["**/*.PNG", "**/*.JPG", "**/*.jpg"],
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      // Custom plugin to handle API routes in development
      mode === "development" && {
        name: 'api-routes',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/create-order')) {
              try {
                // Import the serverless function
                const handler = await import('./api/create-order');

                // Parse the request body
                let body = '';
                req.on('data', chunk => {
                  body += chunk.toString();
                });

                req.on('end', async () => {
                  try {
                    const parsedBody = JSON.parse(body);

                    // Create a mock Vercel request/response with env variables
                    const mockReq = {
                      method: req.method,
                      body: parsedBody,
                    };

                    const mockRes = {
                      status: (code: number) => ({
                        json: (data: any) => {
                          res.statusCode = code;
                          res.setHeader('Content-Type', 'application/json');
                          res.end(JSON.stringify(data));
                        }
                      })
                    };

                    // Set environment variable for the handler
                    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

                    // Call the handler
                    await handler.default(mockReq as any, mockRes as any);
                  } catch (error) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }));
                  }
                });
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to load API handler' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
