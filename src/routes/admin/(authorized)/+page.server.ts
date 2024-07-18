import type { Log } from "$crate/core/entities/log";
import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

type FetchLogsResponse = {
	logs: Array<Log>;
	totalCount: number;
	page: number;
	perPage: number;
};

export type AdminHomePageServerData = {
	success: FetchLogsResponse | null;
	error: string | null;
};

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const response = await fetch(`${env.BACKEND_URL}/log/list`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${locals.accessToken}`,
		},
	});

	if (response.ok) {
		const data: FetchLogsResponse = await response.json();

		// API returns dates as string, so we parse them to JS Dates
		// so that it completely implements the type of Log
		data.logs = data.logs.map((log) => {
			log.createdAt = new Date(log.createdAt);
			return log;
		});

		return { success: data, error: null } satisfies AdminHomePageServerData;
	}

	if (response.status === 400) {
		const data = await response.json();
		return { success: null, error: data.message };
	}

	if (response.status === 401) {
		return { success: null, error: ["Não autorizado."] };
	}

	return { success: null, error: ["Alguma coisa deu errada enquanto carregávamos os logs..."] };
};
