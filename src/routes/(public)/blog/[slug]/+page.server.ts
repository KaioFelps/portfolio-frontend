import type { ExpandedPost } from "$crate/core/entities/expandedPost";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export type GetPostResponse = {
	post: ExpandedPost | null;
	error: string | null;
};

export const load: PageServerLoad = async (ctx) => {
	const response = await ctx.fetch(`${env.BACKEND_URL}/post/${ctx.params.slug}/show`);

	if (!response.ok) {
		ctx.locals.logger.error(
			`Erro inexperado ao visualizar a notícia de slug ${ctx.params.slug}: `,
			await response.text(),
		);

		return { error: "Erro interno.", post: null } satisfies GetPostResponse;
	}

	const data: { post: ExpandedPost } = await response.json();

	const post: ExpandedPost | null = data.post
		? {
				...data.post,
				publishedAt: data.post.publishedAt ? new Date(data.post.publishedAt) : null,
				updatedAt: data.post.updatedAt ? new Date(data.post.updatedAt) : null,
			}
		: null;

	return { post, error: null } satisfies GetPostResponse;
};
