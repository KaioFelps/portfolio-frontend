import type { Post } from "$crate/core/entities/post";
import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import { logger } from "$crate/hooks.server";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export type FetchPostsData = {
	posts: Post[];
	totalCount: number;
	page: number;
	perPage: number;
};

export type FetchPostsResponse = {
	error: string | null;
	data: FetchPostsData | null;
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	let searchParams = url.search;

	const res = await fetch(`/api/blog/nextpage${searchParams}`);

	const data: FetchPostsResponse = await res.json();
	return data;
};
