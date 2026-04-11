import { IncomingHttpHeaders } from "http";
import { auth } from "@/infrastructure/auth/better-auth";
import { AbstractService } from "@/domain/shared/abstract.service";
import { betterAuthConfig } from "@/infrastructure/config";

export class AuthService extends AbstractService {
  buildHeaders(reqHeaders: IncomingHttpHeaders) {
    const authUrl = new URL(betterAuthConfig.url);
    const headers = new Headers();

    for (const [key, value] of Object.entries(reqHeaders)) {
      const k = key.toLowerCase();

      if (["origin", "host", "x-forwarded-proto", "cookie", "content-length"].includes(k)) continue;

      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else if (value) {
        headers.append(key, value);
      }
    }

    headers.set("origin", authUrl.origin);
    headers.set("host", authUrl.host);
    headers.set("x-forwarded-proto", authUrl.protocol.replace(":", ""));

    if (reqHeaders.cookie) {
      headers.set("cookie", reqHeaders.cookie);
    }

    headers.set("cache-control", "no-store");

    return headers;
  }

  async session(reqHeaders: IncomingHttpHeaders) {
    const headers = this.buildHeaders(reqHeaders);
    return await auth.api.getSession({ headers });
  }
}