import { z } from "zod";
import type { RequestEvent } from "@sveltejs/kit";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import { fail, type ActionFailure } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import type { ResponseErrorType } from "$crate/core/types/responseError";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";

const createTagSchema = z.object({
	value: z.string().min(1, "Tag precisa ter 1 caracter no mínimo."),
});

const editTagSchema = z.object({
	value: z.string().min(1, "Tag precisa ter 1 caracter no mínimo."),
	id: z.string().uuid("O ID da tag deve ser um Uuid válido."),
});
type CreateResponseError = ResponseErrorType<typeof createTagSchema, string[]>;
type EditResponseError = ResponseErrorType<typeof editTagSchema, string>;

export type CreateTagResponse = ServerResponseData<{}, CreateResponseError>;
export type EditTagResponse = ServerResponseData<{}, EditResponseError>;

export abstract class TagsActionsHandlers {
	public static async createTag(
		this: RequestEvent,
	): Promise<ActionFailure<CreateTagResponse> | CreateTagResponse> {
		const formData = await this.request.formData();
		const parsedData = createTagSchema.safeParse(Object.fromEntries(formData));

		if (!parsedData.success)
			return fail(
				400,
				MakeServerResponseData.Error<CreateResponseError>({
					validation: true,
					data: parsedData.error.flatten(),
				}),
			);

		const body = JSON.stringify(parsedData.data);
		const response = await fetch(`${env.BACKEND_URL}/tag/new`, {
			method: "POST",
			headers: genHeadersWithAuth(this.locals.accessToken, {
				"Content-Type": "application/json",
			}),
			credentials: "include",
			body,
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		this.locals.logger.error(
			`Falha ao criar uma nova tag no endpoint "/tag/new". Erro: ` + (await response.text()),
		);

		if (response.status === 400) {
			const res = await response.json();
			return fail(
				400,
				MakeServerResponseData.Error<CreateResponseError>({
					validation: false,
					data: res.message as string[],
				}),
			);
		}

		return fail(
			500,
			MakeServerResponseData.Error<CreateResponseError>({
				validation: false,
				data: ["Não foi possível criar a tag."],
			}),
		);
	}

	public static async editTag(
		this: RequestEvent,
	): Promise<ActionFailure<EditTagResponse> | EditTagResponse> {
		const formData = await this.request.formData();
		const parsedData = editTagSchema.safeParse(Object.fromEntries(formData));

		if (!parsedData.success)
			return fail(
				400,
				MakeServerResponseData.Error<EditResponseError>({
					validation: true,
					data: parsedData.error.flatten(),
				}),
			);

		const { id, value } = parsedData.data;

		const response = await this.fetch(`${env.BACKEND_URL}/tag/${id}/edit`, {
			method: "PATCH",
			body: JSON.stringify({
				value,
			}),
			headers: genHeadersWithAuth(this.locals.accessToken),
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		this.locals.logger.error(
			`Falha ao editar tag de ID "${id}" no endpoint "/tag/new". Erro: ` + (await response.text()),
		);

		if (response.status === 401)
			return fail(
				401,
				MakeServerResponseData.Error<EditResponseError>({
					validation: false,
					data: "Você não está autorizado a editar esta tag.",
				}),
			);

		return fail(
			500,
			MakeServerResponseData.Error<EditResponseError>({
				validation: false,
				data: "Não foi possível alterar a tag.",
			}),
		);
	}
}
