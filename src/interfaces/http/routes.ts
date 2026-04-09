import { Elysia } from "elysia";
import { userController } from "./controllers/user.controller";

export const routes = new Elysia({ prefix: "/api" })
  .use(userController);
