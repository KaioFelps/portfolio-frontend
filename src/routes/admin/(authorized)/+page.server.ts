import type { Log } from "$crate/core/entities/log";
import { ServerActionResponse } from "$crate/core/prototypes/serverActionResponse";
import { env } from "$env/dynamic/private";
import type { ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type FetchLogsResponse = {
	logs: Array<Log>;
	totalCount: number;
	page: number;
	perPage: number;
};

type FetchStatisticsResponse = {
	totalPosts: number;
	totalProjects: number;
};

export type AdminHomePageServerData = {
	statistics: ServerActionResponse<FetchStatisticsResponse>;
	logs: ServerActionResponse<FetchLogsResponse, string | string[]>;
};

export const load: PageServerLoad = async (ctx) => {
	const [logs, statistics] = await Promise.all([fetchLogs(ctx), fetchStatistics(ctx)]);

	return {
		logs: logs.toJSON(),
		statistics: statistics.toJSON(),
	} satisfies AdminHomePageServerData;
};

async function fetchLogs({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerActionResponse<FetchLogsResponse, string | string[]>> {
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

		return new ServerActionResponse<FetchLogsResponse>(data, null);
	}

	if (response.status === 400) {
		const data = await response.json();
		return new ServerActionResponse<FetchLogsResponse>(null, data.message);
	}

	if (response.status === 401) {
		return new ServerActionResponse<FetchLogsResponse, string | string[]>(null, ["Não autorizado"]);
	}

	locals.logger.error("Falha ao buscar dados no endpoint de logs (/logs/list): " + response.json());
	return new ServerActionResponse<FetchLogsResponse, string | string[]>(null, [
		"Alguma coisa deu errada enquanto carregávamos os logs...",
	]);
}

async function fetchStatistics({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerActionResponse<FetchStatisticsResponse>> {
	const response = await fetch(`${env.BACKEND_URL}/statistics/count`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${locals.accessToken}`,
		},
	});

	if (response.ok) {
		const data: FetchStatisticsResponse = await response.json();
		return new ServerActionResponse<FetchStatisticsResponse>(data, null);
	}

	locals.logger.error(
		"Falha ao buscar dados no endpoint de estatísticas (/statistics/count): " + response.json(),
	);
	return new ServerActionResponse<FetchStatisticsResponse>(null, "Algo deu errado");
}
