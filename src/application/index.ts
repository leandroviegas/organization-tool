import { transactionContext } from "@/infrastructure/database/prisma/client";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";


export const authService = new AuthService(transactionContext);

export const userService = new UserService(transactionContext);
