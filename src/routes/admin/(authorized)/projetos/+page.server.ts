import type { Project } from "$crate/core/entities/project";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
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

export type DeleteProjectResponse =
	| {
			success: false;
			error: string;
	  }
	| { success: true };

export const actions: Actions = {
	delete: async (ctx) => {
		const formData = await ctx.request.formData();
		const projectId = formData.get("project_id");

		if (!projectId)
			return fail(400, {
				success: false,
				error: "Não é possível apagar um projeto sem ID.",
			} satisfies DeleteProjectResponse);

		await new Promise(async (resolve) => {
			return setTimeout(async () => {
				resolve("");
			}, 2000);
		});

		const response = await ctx.fetch(`${env.BACKEND_URL}/project/${projectId.toString()}/delete`, {
			method: "DELETE",
		});

		if (!response.ok) {
			if (response.status === 401)
				return fail(401, {
					success: false,
					error: "Você não tem autorização para deletar este projeto.",
				} satisfies DeleteProjectResponse);

			ctx.locals.logger.error(
				`Falha ao deletar o projeto de ID ${projectId} no painel de administração`,
				{ message: await response.text() },
			);

			return fail(500, {
				success: false,
				error: "Por algum motivo, não foi possível deletar o projeto agora.",
			} satisfies DeleteProjectResponse);
		}

		return {
			success: true,
		};
	},
};
