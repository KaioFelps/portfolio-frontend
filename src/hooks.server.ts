import type { Handle, HandleFetch } from "@sveltejs/kit";
import winston from "winston";
import { ThemeParser } from "./lib/theme-parser";
import { authenticationMiddleware } from "./middlewares/authentication";

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

export const handleFetch: HandleFetch = ({ event, fetch, request }) => {
	if (event.locals.accessToken)
		request.headers.set("Authorization", `Bearer ${event.locals.accessToken}`);

	return fetch(request);
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.logger = logger;

	const { url } = event;
	logger.info("Request recebida em " + new Date().toString(), {
		url: url.href,
		ip: event.getClientAddress() || null,
	});

	const response = await authenticationMiddleware({ event }, async () => {
		return await resolve(event);
	});

	return await ThemeParser.parse({ response, cookies: event.cookies });
};
