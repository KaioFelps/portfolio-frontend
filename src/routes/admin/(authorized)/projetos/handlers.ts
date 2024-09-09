import type { Project } from "$crate/core/entities/project";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { env } from "$env/dynamic/private";
import { fail, type ActionFailure, type RequestEvent, type ServerLoadEvent } from "@sveltejs/kit";

type ApiResponse = PaginatedResponse & {
	projects: Project[];
};

export type DeleteProjectResponseType = ServerResponseData<{}, string>;
export type PageLoadData = ServerResponseData<ApiResponse, string[]>;

export abstract class ProjectsActionsHandlers {
	public static async load(this: ServerLoadEvent): Promise<PageLoadData> {
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

			return MakeServerResponseData.Ok(data);
		}

		switch (response.status) {
			case 400:
				const error = await response.json();
				return MakeServerResponseData.Error(error.message as string[]);
			case 401:
				return MakeServerResponseData.Error<string[]>(["Não autorizado."]);
			default:
				this.locals.logger.error(
					`Falha ao buscar listagem de projetos "/project/list" no painel de administração: ` +
						(await response.text()),
				);

				return MakeServerResponseData.InternalError();
		}
	}

	public static async delete(
		this: RequestEvent,
	): Promise<ActionFailure<DeleteProjectResponseType> | DeleteProjectResponseType> {
		const formData = await this.request.formData();
		const projectId = formData.get("project_id");

		if (!projectId)
			return fail(400, MakeServerResponseData.Error("Não é possível apagar um projeto sem ID."));

		const response = await this.fetch(`${env.BACKEND_URL}/project/${projectId.toString()}/delete`, {
			method: "DELETE",
			headers: genHeadersWithAuth(this.locals.accessToken),
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		switch (response.status) {
			case 401:
				return fail(
					401,
					MakeServerResponseData.Error("Você não tem autorização para deletar este projeto."),
				);
			default:
				this.locals.logger.error(
					`Falha ao deletar o projeto de ID ${projectId} no painel de administração. Erro: `,
					{ message: await response.text() },
				);

				return fail(
					500,
					MakeServerResponseData.Error(
						"Por algum motivo, não foi possível deletar o projeto agora.",
					),
				);
		}
	}
}
