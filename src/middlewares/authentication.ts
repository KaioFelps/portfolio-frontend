import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export async function authenticationMiddleware(
	{ event }: { event: RequestEvent },
	callback: () => Promise<any>,
) {
	const { cookies, url } = event;

	if (!url.pathname.startsWith("/admin")) return await callback();

	if (event.locals.accessToken && event.locals.user) {
		if (url.pathname !== "/admin/login") return await callback();

		return authenticatedReturnResponse;
	}

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

			if (url.pathname === "/admin/login") return authenticatedReturnResponse;
			return await callback();
		}
	}

	return new Response("User is unauthenticated", {
		status: 302,
		headers: { location: "/admin/login" },
	});
}

const authenticatedReturnResponse = new Response("User is already authenticated", {
	status: 302,
	headers: { location: "/admin" },
});
