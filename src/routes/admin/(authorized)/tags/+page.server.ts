import type { Tag } from "$crate/core/entities/tag";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";

type ApiResponse = PaginatedResponse & {
	tags: Tag[];
};

export type AdminTagPageLoadData = ServerResponseData<ApiResponse, string>;

export const load: PageServerLoad = async ({ fetch, locals }): Promise<AdminTagPageLoadData> => {
	const response = await fetch(`${env.BACKEND_URL}/tag/list`, {
		headers: genHeadersWithAuth(locals.accessToken, {
			Accept: "application/json",
		}),
	});

	switch (response.status) {
		case 200:
			return MakeServerResponseData.Ok((await response.json()) as ApiResponse);
		case 401:
			return MakeServerResponseData.Error("Não autorizado.");
		default:
			locals.logger.error(
				`Falha ao buscar listagem de tags "/tags/list" no painel de administração. Erro: ` +
					(await response.text()),
			);

			return MakeServerResponseData.Error("Não foi possível carregar a listagem de tags.");
	}
};
