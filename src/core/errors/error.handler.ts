import { Prisma } from "@prisma/client";
import { handlePrismaError, handlePrismaValidationError } from "./prisma.handler";
import { languageEnum } from '@/core/constants/language.enum';
import { handleElysiaValidationError } from "./validation.handler";
import { ErrorContext, ValidationError } from "elysia";

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

const defaultLanguage = languageEnum.EN;

export async function errorHandler({ error, set }: ErrorContext & { error: unknown }): Promise<ErrorResponse> {
  if (error instanceof AppError) {
    set.status = error.status;

    return { code: error.errorCode };
  }

  if (error instanceof ValidationError) {
    const elysiaError = error as { all?: readonly { path: string; message: string }[] };
    const { code, status, validations } = await handleElysiaValidationError(
      elysiaError.all ?? [{ path: '', message: error.message }],
      defaultLanguage
    );

    set.status = status;

    return { code, validations };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { code, status, validations } = await handlePrismaError(error, defaultLanguage);

    set.status = status;

    return { code, validations };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const { code, status } = await handlePrismaValidationError(error, defaultLanguage);

    set.status = status;

    return { code };
  }

  const err = error as Error;

  set.status = 500;

  return { code: "INTERNAL_SERVER_ERROR", message: err.message };
}
