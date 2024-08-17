import type { Project } from "$crate/core/entities/project";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { generateQueryString, type Args } from "$crate/core/utils/queryParams";

const apiUrl = (q = "") => `${env.BACKEND_URL}/project/list${q}`;

type ProjectsData = {
	projects: Project[];
	totalCount: number;
	page: number;
	perPage: number;
};

export type FetchProjectsData =
	| {
			success: true;
			data: ProjectsData;
	  }
	| {
			success: false;
			error: string;
	  };

export const load: PageServerLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get("q");
	const queryBy = url.searchParams.get("qb");

	let args: Args = {};
	if (query && queryBy) args[queryBy] = query;

	const queryString = generateQueryString(args);

	const res = await fetch(apiUrl(queryString));

	if (!res.ok) {
		if (res.status >= 500) return { error: "Erro interno" };

		return {
			error: "Ups, algo deu errado =(",
			success: false,
		};
	}

	const data: ProjectsData = await res.json();
	return { success: true, data } satisfies FetchProjectsData;
};

export const actions: Actions = {
	fetchMore: async ({ fetch, url, request }) => {
		const query = url.searchParams.get("q");
		const queryBy = url.searchParams.get("qb");

		let formData = await request.formData();

		const _page = formData.get("page");

		if (!_page || Number.isNaN(_page.toString()))
			return fail(400, {
				success: false,
				error: "Página inválida.",
			} satisfies FetchProjectsData);

		const page = Number(_page.toString());

		let args: Args = { page };

		if (query && queryBy) args[queryBy] = query;

		const queryString = generateQueryString(args);

		const res = await fetch(apiUrl(queryString));

		if (!res.ok) {
			if (res.status >= 500)
				return fail(500, {
					error: "Erro interno",
					success: false,
				} satisfies FetchProjectsData);

			return fail<FetchProjectsData>(res.status, {
				error: "Ups, algo deu errado =(",
				success: false,
			} satisfies FetchProjectsData);
		}

		const data: ProjectsData = await res.json();
		return { success: true, data } satisfies FetchProjectsData;
	},
};
