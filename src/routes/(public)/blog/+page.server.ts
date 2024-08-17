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

export type FetchPostsResponse =
	| {
			success: true;
			data: FetchPostsData;
	  }
	| {
			success: false;
			error: string;
	  };

async function fetchDataAndFormat(queryString: string) {
	const res = await fetch(`${env.BACKEND_URL}/post/list${queryString}`);

	if (!res.ok) {
		if (res.status >= 500) return fail(500, { error: "Erro interno" });

		return fail<FetchPostsResponse>(res.status, {
			error: "Ups, algo deu errado =(",
			success: false,
		});
	}

	const data: FetchPostsData = await res.json();
	return { success: true, data } satisfies FetchPostsResponse;
}

export const load: PageServerLoad = async ({ url, depends }) => {
	let args: Args = {};

	const query = url.searchParams.get("q");
	const queryBy = url.searchParams.get("qb");

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

		const _page = formData.get("page");

		if (!_page || Number.isNaN(_page.toString()))
			return fail(400, {
				success: false,
				error: "Página inválida.",
			} satisfies FetchPostsResponse);

		const page = Number(_page.toString());

		if (queryBy && query) args[queryBy] = query;
		args["page"] = page;

		const queryString = generateQueryString(args);

		return await fetchDataAndFormat(queryString);
	},
};
