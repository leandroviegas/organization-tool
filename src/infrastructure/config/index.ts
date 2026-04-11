import { languageEnum } from "@/core/constants/language.enum";

export const metadata = {
    appName: process.env.APP_NAME || "Boilerplate API",
}

export const serverConfig = {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
    protocol: process.env.PROTOCOL || "http"
};

export const serverUrl = (() => {
    const url = new URL(`${serverConfig.protocol}://${serverConfig.host}`);

    if (serverConfig.port) {
        url.port = serverConfig.port.toString();
    }

    return url.href.replace(/\/$/, "");
})();

export const corsConfig = {
    origin: [...(process.env.CORS_ORIGINS?.split(',') ?? [])],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie', 'set-auth-jwt'],
    exposedHeaders: ['set-cookie', 'set-auth-jwt'],
    credentials: true,
};

export const betterAuthConfig = {
    secret: process.env.BETTER_AUTH_SECRET!,
    url: `${serverUrl}/auth`
}


export const publicConfig = {
    defaultLang: languageEnum.PT
}