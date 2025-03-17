import type { Post } from "$crate/core/entities/post";
import { generateQueryString, type Args } from "$crate/core/utils/query-params";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { ActionFailure, RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import type { ExpandedPost } from "$crate/core/entities/expandedPost";
import type { ServerResponseData } from "$crate/core/types/server-response-data";
import type { PaginatedResponse } from "$crate/core/types/paginated-response";
import { MakeServerResponseData } from "$crate/core/helpers/server-action-response";

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
		const queryBy = ctx.url.searchParams.get("qb");
		const query = ctx.url.searchParams.get("q");
		const _page = formData.get("page")?.toString();

		if (!_page || Number.isNaN(_page))
			return fail(400, MakeServerResponseData.Error("Página inválida."));

		const page = Number(_page);

		if (queryBy && query) args[queryBy] = query;
		args["page"] = page;

		const queryString = generateQueryString(args);

		return await BlogHandlers.fetchDataAndFormat(queryString, ctx.fetch, ctx.locals);
	}

	public static async getPostBySlug(this: ServerLoadEvent): Promise<GetPostBySlugResponse> {
		const slug = this.params.slug;
		const response = await this.fetch(`${env.BACKEND_URL}/post/${slug}/show`);

		if (!response.ok) {
			this.locals.logger.error(
				`Erro inexperado ao visualizar a notícia de slug ${this.params.slug}: `,
				await response.text(),
			);

			return MakeServerResponseData.InternalError();
		}

		const data: { post: ExpandedPost | null } = await response.json();
		if (!data.post) return MakeServerResponseData.Ok(null);

		const { publishedAt, createdAt, updatedAt, ..._post } = data.post;

		const post = {
			..._post,
			createdAt: new Date(createdAt),
			publishedAt: publishedAt ? new Date(publishedAt) : null,
			updatedAt: updatedAt ? new Date(updatedAt) : null,
		};

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
