import { Elysia } from 'elysia';
import { authService } from '@/application';

export const authMiddleware = new Elysia({ name: 'authMiddleware' })
    .derive({ as: 'global' }, async ({ headers }) => {
        const data = await authService.session(headers);

        if (data) 
            return data;
        else throw new Error('Unauthorized');
    });
