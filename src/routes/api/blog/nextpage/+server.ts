import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import type { FetchPostsResponse } from "$crate/routes/(public)/blog/+page.server";
import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url }) => {
	let args: Args = {};

	const queryBy = url.searchParams.get("queryBy");
	const query = url.searchParams.get("query");

	if (queryBy && query) args[queryBy] = query;

	if (url.searchParams.get("page")) args["page"] = Number(url.searchParams.get("page"));

	const queryString = generateQueryString(args);

	const res = await fetch(`${env.BACKEND_URL}/post/list${queryString}`);

	const data: FetchPostsResponse = await res.json();
	return json(data);
};
