import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, organization } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000"],
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
    organization(),
  ],
});

export type Session = typeof auth.$Infer.Session;