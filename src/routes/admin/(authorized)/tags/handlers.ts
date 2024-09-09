import type { ResponseErrorType } from "$crate/core/types/responseError";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import type { RequestEvent, ServerLoadEvent } from "@sveltejs/kit";
import type { Tag } from "$crate/core/entities/tag";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import { editTagSchema } from "./schemas";
import { env } from "$env/dynamic/private";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";

type EditTagErrorType = ResponseErrorType<typeof editTagSchema, string>;
type ApiResponse = PaginatedResponse & {
	tags: Tag[];
};

export type PageLoadData = ServerResponseData<ApiResponse, string>;
export type EditTagResponse = ServerResponseData<{}, EditTagErrorType>;

export abstract class TagsActionsHandlers {
	public static async load(this: ServerLoadEvent): Promise<PageLoadData> {
		const response = await fetch(`${env.BACKEND_URL}/tag/list`, {
			headers: genHeadersWithAuth(this.locals.accessToken, {
				Accept: "application/json",
			}),
		});

		switch (response.status) {
			case 200:
				return MakeServerResponseData.Ok((await response.json()) as ApiResponse);
			case 401:
				return MakeServerResponseData.Error("Não autorizado.");
			default:
				this.locals.logger.error(
					`Falha ao buscar listagem de tags "/tags/list" no painel de administração. Erro: ` +
						(await response.text()),
				);

				return MakeServerResponseData.Error("Não foi possível carregar a listagem de tags.");
		}
	}

	public static async edit(this: RequestEvent): Promise<EditTagResponse> {
		const formData = await this.request.formData();
		const parsedData = editTagSchema.safeParse(Object.fromEntries(formData.entries()));

		if (!parsedData.success) {
			return MakeServerResponseData.Error({
				validation: true,
				data: parsedData.error.flatten(),
			});
		}

		const { _id, value } = parsedData.data;

		const response = await this.fetch(`${env.BACKEND_URL}/tag/${_id}/edit`, {
			method: "PATCH",
			headers: genHeadersWithAuth(this.locals.accessToken),
			body: JSON.stringify({
				value,
			}),
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		switch (response.status) {
			case 401:
				return MakeServerResponseData.Error({
					validation: false,
					data: "Você não está autorizado a editar esta tag.",
				});
			case 400:
				return MakeServerResponseData.Error({
					validation: false,
					data: "ID de tag inválido. Verifique-se de que a tag realmente exista.",
				});
			default:
				this.locals.logger.error(
					`Falhou em editar a tag de id "${_id}". Erro: ` + (await response.text()),
				);
				return MakeServerResponseData.InternalError();
		}
	}
}
