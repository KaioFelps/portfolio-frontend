import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const redirectToLogin = () =>
	new Response("User is unauthenticated", {
		status: 302,
		headers: { location: "/admin/login" },
	});

const redirectToAdminHome = () =>
	new Response("User is already authenticated", {
		status: 302,
		headers: { location: "/admin" },
	});

export async function authenticationMiddleware(
	{ event }: { event: RequestEvent },
	callback: () => Promise<any>,
) {
	const { cookies, url } = event;
	const refreshToken = cookies.get("refresh_token");

	const hasRefreshToken = !!refreshToken;
	const hasAccessToken = event.locals.accessToken;
	const hasAuthUser = event.locals.user;
	const isLoginRoute = url.pathname === "/admin/login";
	const isNotAdminRoute = !url.pathname.startsWith("/admin");

	if (isNotAdminRoute || (hasAccessToken && hasAuthUser && !isNotAdminRoute))
		return await callback();

	if (
		(!hasAccessToken && !hasRefreshToken && !isNotAdminRoute) ||
		(!hasAuthUser && !hasRefreshToken && !isNotAdminRoute)
	)
		return redirectToLogin();

	if ((hasRefreshToken && isLoginRoute) || (hasAccessToken && hasAuthUser && isLoginRoute))
		return redirectToAdminHome();

	if ((!hasAccessToken || !hasAuthUser) && hasRefreshToken && !isNotAdminRoute) {
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

		return redirectToLogin();
	}
}
