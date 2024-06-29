import type { Handle } from "@sveltejs/kit";
import winston from "winston";

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
	const { url, getClientAddress } = event;

	logger.info("Request recebida em " + new Date().toString(), {
		url: url.href,
		client: getClientAddress(),
	});

	const response = await resolve(event);
	return response;
};
