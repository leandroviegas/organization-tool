import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { node } from "@elysiajs/node";
import { cors } from '@elysiajs/cors';
import { routes } from "./routes";
import { errorHandler } from "@/core/errors/error.handler";
import logger from "@/infrastructure/logger/logger";
import { corsConfig, metadata, serverConfig } from "@/infrastructure/config";
import { errorSchema } from "./schemas";
import { seed } from "@/infrastructure/database/prisma/seed";
import { authTag, betterAuthSchema, prefixedAuthPaths } from "@/infrastructure/auth/openapi-better-auth";

seed();

const app = new Elysia({ adapter: node() })
  .onError(errorHandler)
  .model({
    ErrorResponse: errorSchema,
  })
  .guard({
    as: 'global',
    response: {
      400: 'ErrorResponse'
    }
  })
  .use(routes)
  .use(cors(corsConfig))
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: metadata.appName,
        version: '1.0.0'
      },
      tags: [authTag],
      components: betterAuthSchema.components as any,
      paths: prefixedAuthPaths,
    }
  }))
  .listen(serverConfig.port);

logger.info(`Elysia is running at port ${serverConfig.port}`);