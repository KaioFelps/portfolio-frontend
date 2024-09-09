import { fail, type ActionFailure, type RequestEvent, type ServerLoadEvent } from "@sveltejs/kit";
import { publishProjectSchema } from "./schemas";
import type { ResponseErrorType } from "$crate/core/types/responseError";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";
import { env } from "$env/dynamic/private";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import type { Tag } from "$crate/core/entities/tag";

type RequestFormData = {
	title: string;
	topstory: string;
	links: string;
	tags: string;
};

type ResponseError = ResponseErrorType<typeof publishProjectSchema, string | string[]>;
type FetchTagsResponse = PaginatedResponse & { tags: Array<Tag> };

export type PublishResponseType = ServerResponseData<{}, ResponseError>;
export type PageLoadData = { tags: ServerResponseData<FetchTagsResponse, string> };

export abstract class ProjectsActionsHandlers {
	public static async load(this: ServerLoadEvent): Promise<PageLoadData> {
		const response = await fetch(`${env.BACKEND_URL}/tag/list`, {
			headers: genHeadersWithAuth(this.locals.accessToken),
		});

		if (response.ok) {
			const data: FetchTagsResponse = await response.json();
			return { tags: MakeServerResponseData.Ok<FetchTagsResponse>(data) };
		}

		this.locals.logger.error(
			`Falha ao buscar tags no endpoint "/tag/list". Erro: ` + (await response.text()),
		);

		return {
			tags: MakeServerResponseData.Error("Não foi possível carregar as tags disponíveis."),
		};
	}

	public static async publish(
		this: RequestEvent,
	): Promise<ActionFailure<PublishResponseType> | PublishResponseType> {
		let formData = Object.fromEntries(await this.request.formData()) as RequestFormData;
		let _data = {
			...formData,
			links: JSON.parse(formData.links),
			tags: JSON.parse(formData.tags),
		};

		const parsedData = publishProjectSchema.safeParse(_data);

		if (parsedData.error)
			return fail(
				400,
				MakeServerResponseData.Error({ validation: true, data: parsedData.error.flatten() }),
			);

		const data = parsedData.data;

		const response = await fetch(`${env.BACKEND_URL}/project/new`, {
			method: "post",
			headers: genHeadersWithAuth(this.locals.accessToken, {
				"Content-Type": "application/json",
				Accept: "application/json",
			}),
			credentials: "include",
			body: JSON.stringify(data),
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		switch (response.status) {
			case 400:
				const err = await response.json();
				return MakeServerResponseData.Error({
					validation: false,
					data: err.body.message as string[],
				});
			default:
				this.locals.logger.error(
					"Falha ao publicar um projetos no endpoint (/project/new) na rota /admin/projetos/novo: " +
						(await response.text()),
				);

				return MakeServerResponseData.InternalError();
		}
	}
}
