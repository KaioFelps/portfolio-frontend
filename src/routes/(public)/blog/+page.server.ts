import type { Post } from "$crate/core/entities/post";
import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export type FetchPostsResponse = {
	posts: Post[];
	totalCount: number;
	page: number;
	perPage: number;
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	let searchParams = url.search;

	const res = await fetch(`/api/blog/nextpage${searchParams}`);

	const data: FetchPostsResponse = await res.json();
	return data;
};
