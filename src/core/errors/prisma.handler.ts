import { Prisma } from "@prisma/client";
import { ValidationMessageI } from "./error.handler";
import { languageEnum } from "@/core/constants/language.enum";
import { translateValidation } from "@/core/locales";

const PRISMA_ERROR_MAP: Record<string, { code: string; status: number }> = {
  P2001: { code: "RECORD_NOT_FOUND", status: 404 },
  P2003: { code: "FOREIGN_KEY_CONSTRAINT_VIOLATION", status: 400 },
  P2007: { code: "INVALID_DATA", status: 400 },
  P2008: { code: "TIMEOUT_ERROR", status: 504 },
  P2009: { code: "QUERY_ERROR", status: 400 },
  P2010: { code: "RAW_QUERY_ERROR", status: 400 },
  P2011: { code: "NULL_CONSTRAINT_VIOLATION", status: 400 },
  P2012: { code: "MISSING_REQUIRED_VALUE", status: 400 },
  P2013: { code: "MISSING_REQUIRED_ARGUMENT", status: 400 },
  P2014: { code: "RELATION_VIOLATION", status: 400 },
  P2015: { code: "RECORD_NOT_FOUND", status: 404 },
  P2016: { code: "QUERY_INTERPRETATION_ERROR", status: 400 },
  P2017: { code: "RECORD_NOT_FOUND", status: 404 },
  P2018: { code: "CONNECTION_FAILED", status: 500 },
  P2019: { code: "INPUT_ERROR", status: 400 },
  P2020: { code: "VALUE_ERROR", status: 400 },
  P2021: { code: "TABLE_ERROR", status: 500 },
  P2022: { code: "COLUMN_ERROR", status: 500 },
  P2023: { code: "INCONSISTENT_COLUMN_ERROR", status: 500 },
  P2024: { code: "TIMEOUT_ERROR", status: 504 },
  P2025: { code: "RECORD_NOT_FOUND", status: 404 },
};

const extractFields = (meta: any): string[] => {
  if (Array.isArray(meta?.target)) {
    return meta.target;
  }
  return [];
};

export async function handlePrismaError(error: Prisma.PrismaClientKnownRequestError, lang: languageEnum) {
  if (error.code === "P2002") {
    const fields = extractFields(error.meta);
    const validations = fields.map(field => ({
      field,
      message: translateValidation(lang, "P2002").replace('{field}', field)
    }));

    return {
      code: `UNIQUE_CONSTRAINT_VIOLATION`,
      status: 409,
      validations
    };
  }

  const mappedError = PRISMA_ERROR_MAP[error.code];
  if (mappedError) {
    return { ...mappedError };
  }

  return { code: "DATABASE_ERROR", status: 500 };
}

export async function handlePrismaValidationError(error: Prisma.PrismaClientValidationError, lang: languageEnum) {
  return {
    code: "VALIDATION_ERROR",
    status: 400,
    validations: [
      {
        message: error.message.split('\n').pop()?.trim() || translateValidation(lang, "validation")
      }
    ]
  };
}
