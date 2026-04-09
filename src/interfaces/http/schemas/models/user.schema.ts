import { t, Static } from "elysia";

export const UserSchema = t.Object({
  id: t.Optional(t.String({ format: 'uuid' })),
  email: t.String({ format: 'email' }),
  name: t.MaybeEmpty(t.String({ minLength: 2, maxLength: 100 })),
  username: t.MaybeEmpty(t.String({ minLength: 3, maxLength: 50 })),
  image: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});


export type User = Static<typeof UserSchema>;