import { transactionContext } from "@/infrastructure/database/prisma/client";
import { UserService } from "./user/user.service";

export const userService = new UserService(transactionContext);
