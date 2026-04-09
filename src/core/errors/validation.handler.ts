import { languageEnum } from "@/core/constants/language.enum";
import { translateValidation } from "@/core/locales";

export interface ValidationMessageI {
  field?: string;
  message: string;
}

interface ElysiaError {
  path: string;
  message: string;
}

export async function handleElysiaValidationError(
  errors: readonly ElysiaError[],
  lang: languageEnum
) {
  const validations: ValidationMessageI[] = errors.map((err) => ({
    field: err.path.slice(1),
    message: err.message || translateValidation(lang, "validation_error"),
  }));

  return {
    code: "VALIDATION_ERROR",
    status: 400,
    validations,
  };
}
