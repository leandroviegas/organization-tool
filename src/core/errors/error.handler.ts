import { Prisma } from "@prisma/client";
import { handlePrismaError, handlePrismaValidationError } from "./prisma.handler";
import { languageEnum } from '@/core/constants/language.enum';
import { handleElysiaValidationError } from "./validation.handler";
import { ValidationError } from "elysia";

export class AppError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly status: number = 500
  ) {
    super();
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ValidationMessageI {
  field?: string;
  message: string;
}

interface ErrorResponse {
  validations?: ValidationMessageI[];
  code: string;
  message?: string;
}

export async function processError(
  error: unknown,
  lang: languageEnum
): Promise<{ status: number; response: ErrorResponse }> {
  if (error instanceof AppError) {
    return {
      status: error.status,
      response: {
        code: error.errorCode
      }
    };
  }

  if (error instanceof ValidationError) {
    const elysiaError = error as { all?: readonly { path: string; message: string }[] };
    const { code, status, validations } = await handleElysiaValidationError(
      elysiaError.all ?? [{ path: '', message: error.message }],
      lang
    );

    return {
      status,
      response: {
        code,
        validations
      }
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { code, status, validations } = await handlePrismaError(error, lang);
    return {
      status,
      response: {
        code,
        validations
      }
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const { code, status } = await handlePrismaValidationError(error, lang);
    return {
      status,
      response: {
        code
      }
    };
  }

  const err = error as Error;
  return {
    status: 500,
    response: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message
    }
  };
}
