import type { ExpandedPost } from "$crate/core/entities/expandedPost";
import { logger } from "$crate/hooks.server";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export type GetPostResponse = {
	post: ExpandedPost | null;
	error: string | null;
};

export const load: PageServerLoad = async ({ fetch, params: { slug } }) => {
	try {
		const response = await fetch(`${env.BACKEND_URL}/post/${slug}/show`);

		const data: { post: ExpandedPost } = await response.json();

		const post: ExpandedPost | null = data.post
			? {
					...data.post,
					publishedAt: data.post.publishedAt ? new Date(data.post.publishedAt) : null,
					updatedAt: data.post.updatedAt ? new Date(data.post.updatedAt) : null,
				}
			: null;

		return { post, error: null } satisfies GetPostResponse;
	} catch (e) {
		logger.error(e);
		return { error: "Erro interno.", post: null } satisfies GetPostResponse;
	}
};
