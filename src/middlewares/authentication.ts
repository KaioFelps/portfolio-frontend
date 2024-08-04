import type { MaybePromise, RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export async function authenticationMiddleware(
	{ event }: { event: RequestEvent },
	callback: () => MaybePromise<Response>,
) {
	const { cookies, url } = event;
	const refreshToken = cookies.get("refresh_token");

	/* A */ const hasAccessToken = !!event.locals.accessToken;
	/* B */ const hasAuthUser = !!event.locals.user;
	/* C */ const hasRefreshToken = !!refreshToken;
	/* D */ const isNotAdminRoute = !url.pathname.startsWith("/admin");
	/* E */ const isLoginRoute = url.pathname === "/admin/login";
	const isLogoutRoute = url.pathname === "/admin/logout";

	// continue navigation
	if (
		isLogoutRoute ||
		(isNotAdminRoute && !isLoginRoute) ||
		(hasAccessToken && !isLoginRoute && (hasAuthUser || hasRefreshToken)) ||
		(!hasAccessToken && !hasRefreshToken && isLoginRoute) ||
		(!hasAuthUser && !hasRefreshToken && isLoginRoute)
	)
		return await callback();

	//redirect to admin dashboard home
	if (
		(!hasAuthUser && hasRefreshToken && !isNotAdminRoute && isLoginRoute) ||
		(hasAccessToken && hasAuthUser && !isNotAdminRoute && isLoginRoute) ||
		// @ts-expect-error typescript throw type error for XOR operation with boolean
		// it is acceptable tho, once booleans are 0 or 1 numbers
		(!hasAccessToken && hasAuthUser && hasRefreshToken && !(isNotAdminRoute ^ isLoginRoute))
	) {
		const headers = event.request.headers;
		return Redirects.redirectToAdminHome(headers);
	}

	// try to refresh access token and continue navigation
	if (!hasAccessToken && !hasAuthUser && hasRefreshToken && !isNotAdminRoute && !isLoginRoute) {
		const newTokenResponse = await event.fetch(`${env.BACKEND_URL}/auth/refresh`, {
			method: "PATCH",
			headers: {
				Cookie: `refresh_token=${refreshToken}`,
			},
		});

		if (newTokenResponse.ok) {
			const { accessToken, refreshToken, user } = await newTokenResponse.json();
			cookies.set("refresh_token", refreshToken, { path: "/" });
			event.locals.accessToken = accessToken;
			event.locals.user = user;

			return await callback();
		}

		// if it cannot refresh the access token, fully logout the user.
		// clearing the cookie here won't work
		return Redirects.redirectToLogout();
	}

	// redirect to admin dashboard login page
	if (!hasRefreshToken && !isNotAdminRoute && !isLoginRoute && (!hasAccessToken || !hasAuthUser))
		return Redirects.redirectToLogin();

	event.locals.logger.error(
		"Request ultrapassou todas as regras do middleware de autenticação. Variáveis:\n" +
			`A\t${hasAccessToken}\n` +
			`B\t${hasAuthUser}\n` +
			`C\t${hasRefreshToken}\n` +
			`D\t${isNotAdminRoute}\n` +
			`E\t${isLoginRoute}\n`,
	);

	return await callback();
}

abstract class Redirects {
	public static redirectToLogin(): Response {
		return new Response("User is unauthenticated", {
			status: 302,
			headers: { location: "/admin/login" },
		});
	}

	public static redirectToLogout(): Response {
		return new Response("Refresh token is not valid", {
			status: 302,
			headers: { location: "/admin/logout" },
		});
	}

	public static redirectToAdminHome(_headers?: Headers): Response {
		const headers = _headers ? _headers : new Headers();
		headers.set("location", "/admin");

		return new Response("User is already authenticated", {
			status: 302,
			headers,
		});
	}
}
