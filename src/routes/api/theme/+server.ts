import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
	const currentTheme = cookies.get(themeCookieKey);
	let newTheme = currentTheme === "dark" ? "light" : "dark";

	cookies.set(themeCookieKey, newTheme, { path: "/" });
	return json({ theme: newTheme });
};
