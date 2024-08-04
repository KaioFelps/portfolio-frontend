import type { Cookies } from "@sveltejs/kit";
import { PUBLIC_THEME_COOKIE_KEY } from "$env/static/public";

type ParseParams = {
	response: Response;
	cookies: Cookies;
	themeToken?: string;
};

export class ThemeParser {
	public static async parse({
		cookies,
		response,
		themeToken = "%kaio-webiste.theme%",
	}: ParseParams): Promise<Response> {
		if (!(response.headers.get("content-type") === "text/html")) return response;

		const themeCookie = cookies.get(PUBLIC_THEME_COOKIE_KEY);
		let isDark = false;

		if (themeCookie === "dark") isDark = true;

		let bodyBuffers = [];

		// @ts-ignore
		for await (const chunk of response.body) {
			bodyBuffers.push(chunk);
		}

		const body = Buffer.concat(bodyBuffers).toString();
		const newResponseBody = body.replace(themeToken, isDark ? 'class="dark"' : "");

		const headers = response.headers;
		headers.set("content-length", newResponseBody.length.toString());

		return new Response(newResponseBody, {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText,
		});
	}
}
