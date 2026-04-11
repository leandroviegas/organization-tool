import { Elysia } from "elysia";
import { userController } from "./controllers/user.controller";
import { auth } from "@/infrastructure/auth/better-auth";

export const routes = new Elysia({ prefix: "/api" })
  .all("/auth/*", async (c) => {
    return auth.handler(c.request);
  })
  .group('', (app) => app
    .use(userController)
  );
