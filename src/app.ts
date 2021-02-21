import { createServer } from './core/server';

async function app(): Promise<void> {
  const port = process.env.SERVER_PORT || 3000;
  try {
    const server = await createServer();
    server.listen(port);
    console.info(`application listening on http://localhost:${port}`);
  } catch (error) {
    console.error(error);
  }
}

export { app };
