import type { Post } from "$crate/core/entities/post";
import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export type FetchPostsData = {
	posts: Post[];
	totalCount: number;
	page: number;
	perPage: number;
};

export type FetchPostsResponse = {
	success: FetchPostsData | null;
	error: string | null;
};

async function fetchDataAndFormat(queryString: string) {
	const res = await fetch(`${env.BACKEND_URL}/post/list${queryString}`);

	if (!res.ok) {
		if (res.status >= 500) return fail(500, { error: "Erro interno" });

		return fail<FetchPostsResponse>(res.status, {
			error: "Ups, algo deu errado =(",
			success: null,
		});
	}

	const data: FetchPostsData = await res.json();
	return { success: data, error: null } satisfies FetchPostsResponse;
}

export const load: PageServerLoad = async ({ url, depends }) => {
	let args: Args = {};

	const queryBy = url.searchParams.get("queryBy");
	const query = url.searchParams.get("query");

	if (queryBy && query) args[queryBy] = query;

	const queryString = generateQueryString(args);

	return await fetchDataAndFormat(queryString);
};

export const actions: Actions = {
	fetchMore: async ({ request, url }) => {
		let args: Args = {};

		const formData = await request.formData();

		const queryBy = url.searchParams.get("queryBy");
		const query = url.searchParams.get("query");
		const page = formData.get("page")?.toString();

		if (queryBy && query) args[queryBy] = query;
		if (page) args["page"] = page;

		const queryString = generateQueryString(args);

		return await fetchDataAndFormat(queryString);
	},
};
