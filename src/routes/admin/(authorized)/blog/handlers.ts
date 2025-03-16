import type { Tag } from "$crate/core/entities/tag";
import { MakeServerResponseData } from "$crate/core/helpers/server-action-response";
import type { PaginatedResponse } from "$crate/core/types/paginated-response";
import type { ResponseErrorType } from "$crate/core/types/response-error";
import type { ServerResponseData } from "$crate/core/types/server-response-data";
import { env } from "$env/dynamic/private";
import { fail, type ActionFailure, type RequestEvent, type ServerLoadEvent } from "@sveltejs/kit";
import { postSchema, togglePostVisibilitySchema } from "./schemas";
import type { Post } from "$crate/core/entities/post";

type PublishPostResponseError = ResponseErrorType<typeof postSchema, string | string[]>;
type TogglePostVisibilityResponseError = ResponseErrorType<
	typeof togglePostVisibilitySchema,
	string | string[]
>;

export type PublishPostResponse = ServerResponseData<{}, PublishPostResponseError>;
export type TogglePostVisibilityResponse = ServerResponseData<
	{},
	TogglePostVisibilityResponseError
>;

type FetchTagsResponse = PaginatedResponse & { tags: Array<Tag> };
type FetchPostsResponse = PaginatedResponse & { posts: Array<Post> };

export type NewBlogPostPageLoadData = { tags: ServerResponseData<FetchTagsResponse, string> };
export type BlogPostsPageLoadData = { posts: ServerResponseData<FetchPostsResponse, null> };

export abstract class BlogActionsHandlers {
	public static async loadBlogPosts(this: ServerLoadEvent): Promise<BlogPostsPageLoadData> {
		const posts = await this.fetch(`${env.BACKEND_URL}/post/list/admin`);

		if (posts.ok) {
			const data: FetchPostsResponse = await posts.json();
			return { posts: MakeServerResponseData.Ok(data) };
		}

		this.locals.logger.error(
			`Falha ao buscar blogposts no endpoint "/post/list/admin". Err: ` + (await posts.text()),
		);

		return {
			posts: MakeServerResponseData.InternalError(),
		};
	}

	public static async toggleBlogPostVisibility(
		this: RequestEvent,
	): Promise<ActionFailure<TogglePostVisibilityResponse> | TogglePostVisibilityResponse> {
		let formData = Object.fromEntries(await this.request.formData());

		const parseResult = await togglePostVisibilitySchema.safeParseAsync(formData);

		if (!parseResult.success) {
			return fail(
				400,
				MakeServerResponseData.Error({
					validation: true,
					data: parseResult.error.flatten(),
				}),
			);
		}

		const { id } = parseResult.data;

		const response = await this.fetch(`${env.BACKEND_URL}/post/${id}/visibility`, {
			method: "PATCH",
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		switch (response.status) {
			case 400:
				return fail(
					response.status,
					MakeServerResponseData.Error({ validation: false, data: "Post não encontrado." }),
				);
			case 401:
				return fail(
					response.status,
					MakeServerResponseData.Error({
						validation: false,
						data: "Você não tem autorização para publicar este post.",
					}),
				);
			default:
				return fail(500, MakeServerResponseData.InternalError());
		}
	}

	public static async loadNewBlogPostPageData(
		this: ServerLoadEvent,
	): Promise<NewBlogPostPageLoadData> {
		const tagsFetch = await this.fetch(`${env.BACKEND_URL}/tag/list`);

		if (tagsFetch.ok) {
			const data: FetchTagsResponse = await tagsFetch.json();
			return { tags: MakeServerResponseData.Ok<FetchTagsResponse>(data) };
		}

		this.locals.logger.error(
			`Falha ao buscar tags no endpoint "/tag/list". Err: ` + (await tagsFetch.text()),
		);

		return {
			tags: MakeServerResponseData.Error("Não foi possível carregar as tags disponíveis."),
		};
	}

	public static async publish(
		this: RequestEvent,
	): Promise<ActionFailure<PublishPostResponse> | PublishPostResponse> {
		type RequestFormData = {
			title: string;
			topstory: string;
			content: string;
			tags: string;
		};

		let formData = Object.fromEntries(await this.request.formData());
		formData = { ...formData, tags: JSON.parse((formData as RequestFormData).tags) };

		const parseResult = await postSchema.safeParseAsync(formData);

		if (!parseResult.success) {
			return fail(
				400,
				MakeServerResponseData.Error({
					validation: true,
					data: parseResult.error.flatten(),
				}),
			);
		}

		const { data } = parseResult;

		const postResponse = await this.fetch(`${env.BACKEND_URL}/post/new`, {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(data),
		});

		if (postResponse.ok) {
			return MakeServerResponseData.Ok({});
		}

		switch (postResponse.status) {
			case 401:
				return MakeServerResponseData.Error({ validation: false, data: "Não autorizado." });

			case 400:
				const err = await postResponse.json();
				this.locals.logger.error("Erro de má-requisição ao publicar uma postagem: ", err);
				return MakeServerResponseData.Error({ validation: false, data: err.body.message });

			default:
				this.locals.logger.error(
					"Falha ao publicar um novo post no endpoint '/post/new': " + (await postResponse.text()),
				);
				return MakeServerResponseData.InternalError();
		}
	}
}
