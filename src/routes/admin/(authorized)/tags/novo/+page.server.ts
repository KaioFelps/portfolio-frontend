import { fail, type Actions } from "@sveltejs/kit";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import { env } from "$env/dynamic/private";
import { z } from "zod";

const createTagSchema = z.object({
	value: z.string().min(1, "Tag precisa ter 1 caracter no mínimo."),
});

export type CreateTagResponse = {
	success: boolean;
	zod: z.inferFlattenedErrors<typeof createTagSchema> | null;
	error: string | null;
};

export const actions: Actions = {
	async create({ request, fetch, locals }) {
		const formData = await request.formData();
		const parsedData = createTagSchema.safeParse(Object.fromEntries(formData));

		if (!parsedData.success) {
			return fail(400, {
				error: null,
				zod: parsedData.error.flatten(),
				success: false,
			} satisfies CreateTagResponse);
		}

		const body = JSON.stringify(parsedData.data);

		const response = await fetch(`${env.BACKEND_URL}/tag/new`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${locals.accessToken}`,
			},
			credentials: "include",
			body,
		});

		if (response.ok) {
			return {
				error: null,
				zod: null,
				success: true,
			} satisfies CreateTagResponse;
		}

		locals.logger.error(
			"Falha ao cria r uma nova tag no endpoint (/tag/new), na rota /admin/tags/novo: " +
				(await response.text()),
		);

		if (response.status === 400) {
			const res = await response.json();
			return new ServerActionResponse(null as boolean | null, res.message as string[]);
		}

		return {
			error: "Não foi possível criar a tag.",
			zod: null,
			success: false,
		} satisfies CreateTagResponse;
	},
};
