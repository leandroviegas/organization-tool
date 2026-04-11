import { auth } from "./better-auth";

export const betterAuthSchema = await auth.api.generateOpenAPISchema();
export const authPathPrefix = "/api/auth";
export const authTag = {
    name: "Auth",
    description: "Better Auth authentication endpoints"
};
export const prefixedAuthPaths = Object.fromEntries(
  Object.entries(betterAuthSchema.paths ?? {}).map(([path, value]) => {
    const prefixed = authPathPrefix + path;
    const taggedValue = Object.fromEntries(
      Object.entries(value as object).map(([method, operation]) => [
        method,
        { ...(operation as object), tags: ["Auth"] },
      ])
    );
    return [prefixed, taggedValue];
  })
);