import type { Project } from "$crate/core/entities/project";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "../$types";

type ApiResponse = PaginatedResponse & {
	projects: Project[];
};

export type AdminProjectPageServerData = ServerActionResponse<ApiResponse>;

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/project/list`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});

	if (response.ok) {
		const data: ApiResponse = await response.json();

		data.projects = data.projects.map((project) => ({
			...project,
			createdAt: new Date(project.createdAt),
		}));

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
		"Falha ao buscar listagem de projetos (/project/list) no painel de administração: " +
			(await response.text()),
	);

	return new ServerActionResponse<ApiResponse, string | string[]>(null, [
		"Não foi possível carregar a listagem de projetos.",
	]);
};
