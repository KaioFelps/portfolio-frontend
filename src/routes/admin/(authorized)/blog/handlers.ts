import type { Tag } from "$crate/core/entities/tag";
import { MakeServerResponseData } from "$crate/core/helpers/server-action-response";
import type { PaginatedResponse } from "$crate/core/types/paginated-response";
import type { ResponseErrorType } from "$crate/core/types/response-error";
import type { ServerResponseData } from "$crate/core/types/server-response-data";
import { env } from "$env/dynamic/private";
import { fail, type ActionFailure, type RequestEvent, type ServerLoadEvent } from "@sveltejs/kit";
import { publishPostSchema } from "./schemas";

type ResponseError = ResponseErrorType<typeof publishPostSchema, string | string[]>;

export type PublishPostResponse = ServerResponseData<{}, ResponseError>;

type FetchTagsResponse = PaginatedResponse & { tags: Array<Tag> };
export type PageLoadData = { tags: ServerResponseData<FetchTagsResponse, string> };

export abstract class BlogActionsHandlers {
	public static async load(this: ServerLoadEvent): Promise<PageLoadData> {
		const tagsFetch = await this.fetch(`${env.BACKEND_URL}/tag/list`);

		if (tagsFetch.ok) {
			const data: FetchTagsResponse = await tagsFetch.json();
			return { tags: MakeServerResponseData.Ok<FetchTagsResponse>(data) };
		}

		this.locals.logger.error(
			`Falha aoo buscar tags no endpoint "/tag/list". Err: ` + (await tagsFetch.text()),
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

		const parseResult = await publishPostSchema.safeParseAsync(formData);

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
