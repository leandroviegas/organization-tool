import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { node } from "@elysiajs/node";
import { cors } from '@elysiajs/cors';
import { routes } from "./routes";
import { processError } from "@/core/errors/error.handler";
import { languageEnum } from "@/core/constants/language.enum";
import logger from "@/infrastructure/logger/logger";
import { corsConfig, serverConfig } from "@/infrastructure/config/env";
import { errorSchema } from "./schemas";
import { seed } from "@/infrastructure/database/prisma/seed";

seed();

const app = new Elysia({ adapter: node() })
  .onError(async ({ error, set }) => {
    const language = languageEnum.EN;

    const { status, response } = await processError(error, language);

    set.status = status;

    return response;
  })
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
        title: `${process.env.APP_NAME}`,
        version: '1.0.0'
      }
    }
  }))
  .listen(serverConfig.port);

logger.info(`Elysia is running at port ${serverConfig.port}`);