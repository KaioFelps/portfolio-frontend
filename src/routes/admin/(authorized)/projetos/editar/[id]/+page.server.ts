import type { Project } from "$crate/core/entities/project";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { z } from "zod";
import { fail, type Actions, type ServerLoadEvent } from "@sveltejs/kit";
import type { Tag } from "$crate/core/entities/tag";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";

type FetchTagsResponse = PaginatedResponse & {
	tags: Array<Tag>;
};

export type AdminEditProjectPageData = {
	project: ServerResponseData<Project | null, string>;
	tags: ServerResponseData<FetchTagsResponse, string>;
};

export const load: PageServerLoad = async (ctx): Promise<AdminEditProjectPageData> => {
	let projectResponse: ServerResponseData<Project | null, string>;
	const availableTags = await getAvailableTags(ctx);

	try {
		const response = await fetch(`${env.BACKEND_URL}/project/${ctx.params.id}`, {
			headers: genHeadersWithAuth(ctx.locals.accessToken),
		});

		let project: Project | null = null;
		const data: { project: Project | null } = await response.json();

		if (data.project) project = { ...data.project, createdAt: new Date(data.project.createdAt) };

		projectResponse = MakeServerResponseData.Ok(data.project);
	} catch (error) {
		ctx.locals.logger.error(error);
		projectResponse = MakeServerResponseData.Error("Erro interno");
	}

	return { project: projectResponse, tags: availableTags } satisfies AdminEditProjectPageData;
};

async function getAvailableTags({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerResponseData<FetchTagsResponse, string>> {
	try {
		const response = await fetch(`${env.BACKEND_URL}/tag/list`);

		if (response.ok) {
			const data: FetchTagsResponse = await response.json();
			return MakeServerResponseData.Ok(data);
		}

		locals.logger.error(
			`Falha ao buscar tags no endpoint "/tag/list". Erro: ` + (await response.text()),
		);
		return MakeServerResponseData.Error("Não foi possível carregar as tags disponíveis.");
	} catch (error) {
		locals.logger.error(`Falha ao buscar tags no endpoint "/tag/list". Erro: ` + error);
		return MakeServerResponseData.Error("Não foi possível carregar as tags disponíveis.");
	}
}

// Form

type RequestFormData = {
	title: string;
	topstory: string;
	links: string;
	tags: string;
};

const editProjectSchema = z.object({
	_id: z.string().uuid("Id precisa ser um UUID válido."),
	title: z.string().min(1, "Título precisa ter 1 caractere no mínimo.").optional(),
	topstory: z
		.string()
		.url("A imagem de capa precisa ser um link válido (com protocólo incluso).")
		.optional(),
	links: z
		.array(
			z.object({
				title: z.string().min(1, "Os títulos dos links precisam ter no mínimo 1 caractere."),
				value: z
					.string()
					.url("Todo valor de link precisa ser uma url válida (com protocólo incluso)."),
			}),
		)
		.optional(),
	tags: z.array(z.string().uuid()).min(1, "O projeto precisa ter no mínimo 1 tag.").optional(),
});

export type EditProjectResponse =
	| { success: true }
	| {
			success: false;
			isValidationError: false;
			error: string;
	  }
	| {
			success: false;
			isValidationError: true;
			errors: string[];
			zod: z.inferFlattenedErrors<typeof editProjectSchema> | null;
	  };

export const actions: Actions = {
	async save({ request, fetch, locals }) {
		let formData = Object.fromEntries(await request.formData()) as RequestFormData;
		let _data = { ...formData };
		if (formData.links) _data.links = JSON.parse(formData.links);
		if (formData.tags) _data.tags = JSON.parse(formData.tags);

		const parsedData = editProjectSchema.safeParse(_data);

		if (parsedData.error) {
			return fail(400, {
				success: false,
				isValidationError: true,
				zod: parsedData.error.flatten(),
				errors: [],
			} as EditProjectResponse);
		}

		const { _id: projectId, ...data } = parsedData.data;

		if (Object.keys(data).length <= 0) return { success: true } satisfies EditProjectResponse;

		const response = await fetch(`${env.BACKEND_URL}/project/${projectId}/edit`, {
			method: "put",
			headers: genHeadersWithAuth(locals.accessToken, {
				"Content-Type": "application/json",
				Accept: "application/json",
			}),
			credentials: "include",
			body: JSON.stringify(data),
		});

		if (response.ok) {
			return { success: true } satisfies EditProjectResponse;
		}

		if (response.status === 400) {
			const res = await response.json();

			return {
				success: false,
				isValidationError: true,
				errors: res.body.message as string[],
				zod: null,
			} satisfies EditProjectResponse;
		}

		locals.logger.error(
			`Falha ao atualizar um projeto no endpoint "/project/:id/edit". Erro: ` +
				(await response.text()),
		);

		return {
			success: false,
			isValidationError: false,
			error: "Não foi possível publicar o projeto agora.",
		} satisfies EditProjectResponse;
	},
};
