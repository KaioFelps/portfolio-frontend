import { fail, type Actions, type ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Tag } from "$crate/core/entities/tag";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import { env } from "$env/dynamic/private";
import { z } from "zod";

export type AdminNewProjectPageServerData = {
	tags: ServerActionResponse<FetchTagsResponse>;
};

type FetchTagsResponse = PaginatedResponse & {
	tags: Array<Tag>;
};

export const load: PageServerLoad = async (ctx) => {
	const tags = await getAvailableTags(ctx);

	return {
		tags: tags.toJSON(),
	} satisfies AdminNewProjectPageServerData;
};

type RequestFormData = {
	title: string;
	topstory: string;
	links: string;
	tags: string;
};

const publishProjectSchema = z.object({
	title: z.string().min(1, "Título precisa ter 1 caractere no mínimo."),
	topstory: z.string().url("A imagem de capa precisa ser um link válido (com protocólo incluso)."),
	links: z.array(
		z.object({
			title: z.string().min(1, "Os títulos dos links precisam ter no mínimo 1 caractere."),
			value: z
				.string()
				.url("Todo valor de link precisa ser uma url válida (com protocólo incluso)."),
		}),
	),
	tags: z.array(z.string().uuid()).min(1, "O projeto precisa ter no mínimo 1 tag."),
});

export type PublishProjectResponse = {
	success: boolean;
	zod: z.inferFlattenedErrors<typeof publishProjectSchema> | null;
	error: string[] | string | null;
};

export const actions: Actions = {
	async publish({ request, fetch, locals }) {
		let formData = Object.fromEntries(await request.formData()) as RequestFormData;
		let _data = {
			...formData,
			links: JSON.parse(formData.links),
			tags: JSON.parse(formData.tags),
		};

		const parsedData = publishProjectSchema.safeParse(_data);

		if (parsedData.error) {
			return fail(400, {
				error: null,
				success: false,
				zod: parsedData.error.flatten(),
			} as PublishProjectResponse);
		}

		const data = parsedData.data;

		const response = await fetch(`${env.BACKEND_URL}/project/new`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${locals.accessToken}`,
			},
			credentials: "include",
			body: JSON.stringify(data),
		});

		if (response.ok) {
			return {
				error: null,
				success: true,
				zod: null,
			} satisfies PublishProjectResponse;
		}

		if (response.status === 400) {
			const res = await response.json();

			return {
				error: res.body.message as string[],
				success: false,
				zod: null,
			} satisfies PublishProjectResponse;
		}

		locals.logger.error(
			"Falha ao publicar um projetos no endpoint (/project/new) na rota /admin/projetos/novo: " +
				(await response.text()),
		);

		return {
			error: "Não foi possível publicar o projeto agora.",
			success: false,
			zod: null,
		} satisfies PublishProjectResponse;
	},
};

async function getAvailableTags({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerActionResponse<FetchTagsResponse>> {
	const response = await fetch(`${env.BACKEND_URL}/tag/list`, {
		headers: {
			Authorization: `Bearer ${locals.accessToken}`,
		},
	});

	if (response.ok) {
		const data: FetchTagsResponse = await response.json();
		return new ServerActionResponse<FetchTagsResponse>(data, null);
	}

	locals.logger.error(
		"Falha ao buscar tags no endpoint (/tag/list), na rota /admin/projetos/novo: " +
			(await response.text()),
	);
	return new ServerActionResponse<FetchTagsResponse>(
		null,
		"Não foi possível carregar as tags disponíveis.",
	);
}
