import type { Tag } from "$crate/core/entities/tag";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../$types";

type ApiResponse = PaginatedResponse & {
	tags: Tag[];
};

export type AdminTagPageServerData = ServerActionResponse<ApiResponse>;

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/tag/list`, {
		headers: {
			Accept: "application/json",
		},
	});

	if (response.ok) {
		const data: ApiResponse = await response.json();
		return new ServerActionResponse(data, null).toJSON();
	}

	if (response.status === 400) {
		const data = await response.json();
		return new ServerActionResponse<ApiResponse>(null, data.message);
	}

	if (response.status === 401) {
		return new ServerActionResponse<ApiResponse, string | string[]>(null, ["Não autorizado."]);
	}

	locals.logger.error(
		"Falha ao buscar listagem de tags (/tags/list) no painel de administração: " +
			(await response.text()),
	);

	return new ServerActionResponse<ApiResponse, string | string[]>(null, [
		"Não foi possível carregar a listagem de tags.",
	]);
};
