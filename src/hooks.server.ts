import type { Handle } from "@sveltejs/kit";
import winston from "winston";
import { ThemeParser } from "./lib/theme-parser";
import { authenticationMiddleware } from "./middlewares/authentication";
import { env } from "$env/dynamic/private";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		//
		// - Write all logs with importance level of `error` or less to `error.log`
		// - Write all logs with importance level of `info` or less to `combined.log`
		//
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

logger.add(
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.cli(),
			winston.format.colorize({
				all: true,
				colors: { info: "blue", error: "red", warn: "yellow" },
			}),
		),
	}),
);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.logger = logger;

	event.locals.logger.info(`[${new Date().toLocaleString()}]\t${event.request.url}`);

	const response = await authenticationMiddleware({ event }, async () => {
		return await resolve(event);
	});

	return await ThemeParser.parse({ response, cookies: event.cookies });
};

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch, event }) {
	if (request.url.startsWith(env.BACKEND_URL)) {
		if (event.locals.accessToken) {
			request.headers.set("Authorization", `Bearer ${event.locals.accessToken}`);
			request.headers.set("Accept", "application/json");
		}
	}

	return fetch(request);
}
