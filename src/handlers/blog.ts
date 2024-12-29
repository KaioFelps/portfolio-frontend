import type { Post } from "$crate/core/entities/post";
import { generateQueryString, type Args } from "$crate/core/utils/queryParams";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { ActionFailure, RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import type { ExpandedPost } from "$crate/core/entities/expandedPost";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";

type PaginatedPosts = PaginatedResponse & { posts: Post[] };
export type LoadPaginatedPosts = ServerResponseData<PaginatedPosts, string>;
export type GetPostBySlugResponse = ServerResponseData<ExpandedPost | null, null>;

export abstract class BlogHandlers {
	public static async loadAllPosts(ctx: ServerLoadEvent): Promise<LoadPaginatedPosts> {
		let args: Args = {};
		const query = ctx.url.searchParams.get("q");
		const queryBy = ctx.url.searchParams.get("qb");

		if (queryBy && query) args[queryBy] = query;

		const queryString = generateQueryString(args);

		return await BlogHandlers.fetchDataAndFormat(queryString, ctx.fetch, ctx.locals);
	}

	public static async fetchMorePosts(
		ctx: RequestEvent,
	): Promise<ActionFailure<LoadPaginatedPosts> | LoadPaginatedPosts> {
		let args: Args = {};

		const formData = await ctx.request.formData();
		const queryBy = ctx.url.searchParams.get("queryBy");
		const query = ctx.url.searchParams.get("query");
		const _page = formData.get("page")?.toString();

		if (!_page || Number.isNaN(_page))
			return fail(400, MakeServerResponseData.Error("Página inválida."));

		const page = Number(_page);

		if (queryBy && query) args[queryBy] = query;
		args["page"] = page;

		const queryString = generateQueryString(args);

		return await BlogHandlers.fetchDataAndFormat(queryString, ctx.fetch, ctx.locals);
	}

	public static async getPostBySlug(ctx: ServerLoadEvent): Promise<GetPostBySlugResponse> {
		const response = await ctx.fetch(`${env.BACKEND_URL}/post/${ctx.params.slug}/show`);

		if (!response.ok) {
			ctx.locals.logger.error(
				`Erro inexperado ao visualizar a notícia de slug ${ctx.params.slug}: `,
				await response.text(),
			);

			return MakeServerResponseData.InternalError();
		}

		const data: { post: ExpandedPost | null } = await response.json();

		const post: ExpandedPost | null = data.post
			? {
					...data.post,
					publishedAt: data.post.publishedAt ? new Date(data.post.publishedAt) : null,
					updatedAt: data.post.updatedAt ? new Date(data.post.updatedAt) : null,
				}
			: null;

		return MakeServerResponseData.Ok(post);
	}

	private static async fetchDataAndFormat(
		queryString: string,
		fetch: ServerLoadEvent["fetch"],
		locals: App.Locals,
	): Promise<ServerResponseData<PaginatedPosts, string>> {
		const res = await fetch(`${env.BACKEND_URL}/post/list${queryString}`);

		if (res.ok) {
			const data = await res.json();
			return MakeServerResponseData.Ok(data);
		}

		locals.logger.error("Falhou ao buscar blogposts na rota '/post/list': ", await res.text());

		if (res.status >= 500) return MakeServerResponseData.InternalError();

		return MakeServerResponseData.Error("Ups, algo deu errado =(");
	}
}
