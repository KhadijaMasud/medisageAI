import type { Express } from "express";
import { createServer } from "vite";

export const setupVite = async (app: Express, server: any) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
};

export const serveStatic = (app: Express) => {
  // add static serving logic here for production
};

export const log = console.log;
