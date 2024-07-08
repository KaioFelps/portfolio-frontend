import type { Project } from "$crate/core/entities/project";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const apiUrl = `${env.BACKEND_URL}/project/list`;

type ProjectsData = { projects: Project[]; totalCount: number; page: number; perPage: number };

export type FetchProjectsData = {
	success: ProjectsData | null;
	error: string | null;
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	let query = url.searchParams.get("query");

	const res = await fetch(`${apiUrl}?query=${query}`);

	if (!res.ok) {
		if (res.status >= 500) return fail(500, { error: "Erro interno" });

		return fail<FetchProjectsData>(res.status, { error: "Ups, algo deu errado =(", success: null });
	}

	const data: ProjectsData = await res.json();
	return { success: data, error: null } satisfies FetchProjectsData;
};

export const actions: Actions = {
	fetchMore: async ({ fetch, url }) => {
		let query = url.searchParams.get("query");
		let page = url.searchParams.get("page");

		const res = await fetch(`${apiUrl}?query=${query}&page=${page}`);

		if (!res.ok) {
			if (res.status >= 500) return fail(500, { error: "Erro interno" });

			return fail<FetchProjectsData>(res.status, {
				error: "Ups, algo deu errado =(",
				success: null,
			});
		}

		const data: ProjectsData = await res.json();
		return { success: data, error: null } satisfies FetchProjectsData;
	},
};
