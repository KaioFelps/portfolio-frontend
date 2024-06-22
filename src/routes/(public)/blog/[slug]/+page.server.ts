import type { ExpandedPost } from "$crate/core/entities/expandedPost";
import type { Tag } from "$crate/core/entities/tag";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export type GetPostResponse = {
	post: ExpandedPost | null;
};

export const load: PageServerLoad = async ({ fetch, params: { slug } }) => {
	const response = await fetch(`${env.BACKEND_URL}/post/${slug}/show`);
	const data: { post: ExpandedPost } = await response.json();

	const post: ExpandedPost | null = data.post
		? {
				...data.post,
				publishedAt: data.post.publishedAt ? new Date(data.post.publishedAt) : null,
				updatedAt: data.post.updatedAt ? new Date(data.post.updatedAt) : null,
			}
		: null;

	return { post } satisfies GetPostResponse;
};
