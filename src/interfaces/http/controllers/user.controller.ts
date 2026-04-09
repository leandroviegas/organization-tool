import { Elysia, t } from "elysia";
import { userService } from "@/application";
import { metaSchema, paginationSchema } from "@/interfaces/http/schemas/pagination";
import { UserSchema } from "../schemas/models/user.schema";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", async ({ query }) => {
    const { users, meta } = await userService.findAll(query);

    return {
      code: "success",
      data: users,
      meta
    }
  }, {
    query: paginationSchema,
    response: t.Object({
      code: t.String(),
      data: t.Array(UserSchema),
      meta: metaSchema
    })
  })


  .get("/:id", async ({ params: { id } }) => {
    const user = await userService.findById(id);

    return {
      code: "success",
      data: user
    };
  }, {
    params: t.Object({ id: t.String() }),
    response: t.Object({
      code: t.String(),
      data: UserSchema
    })
  })


  .patch("/:id", async ({ params: { id }, body }) => {
    const user = await userService.update(id, body);

    return {
      code: "success",
      data: user
    };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Pick(UserSchema, ['email', 'name', 'username', 'image', 'preferences']),
    response: t.Object({
      code: t.String(),
      data: UserSchema
    })
  })


  .delete("/:id", async ({ params: { id } }) => {
    await userService.delete(id);

    return {
      code: "success"
    };
  }, {
    params: t.Object({ id: t.String() }),
    response: t.Object({
      code: t.String()
    })
  });
