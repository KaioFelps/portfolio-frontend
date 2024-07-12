import type { Cookies, Handle, RequestEvent } from "@sveltejs/kit";
import winston from "winston";
import { ThemeParser } from "./lib/theme-parser";
import { env } from "$env/dynamic/private";

globalThis.themeCookieKey = "kaiofelps_theme";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "user-service" },
	transports: [
		//
		// - Write all logs with importance level of `error` or less to `error.log`
		// - Write all logs with importance level of `info` or less to `combined.log`
		//
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

//
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
logger.add(
	new winston.transports.Console({
		format: winston.format.simple(),
	}),
);

export const handle: Handle = async ({ event, resolve }) => {
	const { url, getClientAddress, cookies } = event;

	logger.info("Request recebida em " + new Date().toString(), {
		url: url.href,
		client: getClientAddress(),
	});

	return await authenticationMiddleware({ event }, async () => {
		const response = await resolve(event);
		return await ThemeParser.parse({ response, cookies: event.cookies });
	});
};

async function authenticationMiddleware({ event }: { event: RequestEvent }, callback: () => any) {
	const { cookies, url } = event;

	if (cookies.get("access_token")) {
		event.locals.accessToken = cookies.get("access_token");

		cookies.delete("access_token", {
			path: "/",
		});
	}

	if (cookies.get("refresh_token")) {
		const newTokenResponse = await event.fetch(`${env.BACKEND_URL}/auth/refresh`, {
			method: "PATCH",
			headers: {
				Cookie: `refresh_token=${cookies.get("refresh_token")}`,
			},
		});

		if (newTokenResponse.ok) {
			const { access_token, refreshToken } = await newTokenResponse.json();
			cookies.set("refresh_token", refreshToken, { path: "/" });
			event.locals.accessToken = access_token;
		}
	}

	if (url.pathname === "/admin/login" && event.locals.accessToken) {
		return new Response("Already authenticated user", {
			status: 302,
			headers: { location: "/admin" },
		});
	}

	if (
		url.pathname.startsWith("/admin") &&
		url.pathname !== "/admin/login" &&
		!event.locals.accessToken
	) {
		return new Response("Unauthenticated user", {
			status: 302,
			headers: { location: "/admin/login" },
		});
	}

	return callback();
}
