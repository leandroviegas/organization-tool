import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";
import { betterAuthConfig, corsConfig } from "../config";
import { prisma } from "../database/prisma/client";

export const auth = betterAuth({
  baseURL: betterAuthConfig.url,
  trustedOrigins: corsConfig.origin,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token }) => {
      console.log("Reset password email:", { user, token });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      console.log("Verification email:", { user, token });
    },
  },
  rateLimit: {
    window: 10,
    max: 100,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  },
  logger: {
    disabled: false,
  },
  plugins: [
    bearer(),
    openAPI()
  ],
});

export type Session = typeof auth.$Infer.Session;