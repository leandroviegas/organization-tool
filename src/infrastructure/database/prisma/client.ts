import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";
import { PrismaTransactionContext } from "./transaction-context";

export const prisma = new PrismaClient().$extends(pagination());

export type ExtendedPrismaClient = typeof prisma;

export const transactionContext = new PrismaTransactionContext(prisma);
