import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import type { FetchPostsResponse, FetchPostsData } from "$crate/routes/(public)/blog/+page.server";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { logger } from "$crate/hooks.server";

export const GET: RequestHandler = async ({ fetch, url }) => {
	let args: Args = {};

	const queryBy = url.searchParams.get("queryBy");
	const query = url.searchParams.get("query");

	if (queryBy && query) args[queryBy] = query;

	if (url.searchParams.get("page")) args["page"] = Number(url.searchParams.get("page"));

	const queryString = generateQueryString(args);

	try {
		const res = await fetch(`${env.BACKEND_URL}/post/list${queryString}`);

		const data: FetchPostsData = await res.json();

		return json({ data, error: null } satisfies FetchPostsResponse);
	} catch (e) {
		logger.error(e);

		return json({
			data: null,
			error: "Algo deu errado enquanto tentava buscar os posts =(",
		} satisfies FetchPostsResponse);
	}
};
