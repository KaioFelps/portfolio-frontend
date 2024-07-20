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
	event.locals.logger = logger;

	const { url, getClientAddress, cookies } = event;

	logger.info("Request recebida em " + new Date().toString(), {
		url: url.href,
		client: getClientAddress(),
	});

	const response = await authenticationMiddleware({ event }, async () => {
		return await resolve(event);
	});

	return await ThemeParser.parse({ response, cookies: event.cookies });
};

async function authenticationMiddleware(
	{ event }: { event: RequestEvent },
	callback: () => Promise<any>,
) {
	const { cookies, url } = event;

	if (!url.pathname.startsWith("/admin")) return await callback();

	if (url.pathname === "/admin/login") {
		if (event.locals.accessToken && event.locals.user)
			return new Response("Already authenticated user", {
				status: 302,
				headers: { location: "/admin" },
			});

		return await callback();
	}

	if (event.locals.accessToken && event.locals.user) return await callback();

	if (cookies.get("refresh_token")) {
		const newTokenResponse = await event.fetch(`${env.BACKEND_URL}/auth/refresh`, {
			method: "PATCH",
			headers: {
				Cookie: `refresh_token=${cookies.get("refresh_token")}`,
			},
		});

		if (newTokenResponse.ok) {
			const { accessToken, refreshToken, user } = await newTokenResponse.json();
			cookies.set("refresh_token", refreshToken, { path: "/" });
			event.locals.accessToken = accessToken;
			event.locals.user = user;

			return await callback();
		}
	}

	return new Response("Unauthenticated user", {
		status: 302,
		headers: { location: "/admin/login" },
	});
}
