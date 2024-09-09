import type { Log } from "$crate/core/entities/log";
import { genHeadersWithAuth } from "$crate/core/helpers/getAuthHeader";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { env } from "$env/dynamic/private";
import type { ServerLoadEvent } from "@sveltejs/kit";

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

export type PageLoadData = {
	statistics: ServerResponseData<FetchStatisticsResponse, string>;
	logs: ServerResponseData<FetchLogsResponse, string | string[]>;
};

export abstract class AdminPagesRootActionsHandlers {
	public static async load(this: ServerLoadEvent) {
		const [logs, statistics] = await Promise.all([fetchLogs(this), fetchStatistics(this)]);

		return {
			logs,
			statistics,
		} satisfies PageLoadData;
	}
}

async function fetchLogs({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerResponseData<FetchLogsResponse, string | string[]>> {
	const response = await fetch(`${env.BACKEND_URL}/log/list`, {
		headers: genHeadersWithAuth(locals.accessToken, {
			"Content-Type": "application/json",
			Accept: "application/json",
		}),
	});

	if (response.ok) {
		const data: FetchLogsResponse = await response.json();

		// API returns dates as string, so we parse them to JS Dates
		// so that it completely implements the type of Log
		data.logs = data.logs.map((log) => {
			log.createdAt = new Date(log.createdAt);
			return log;
		});

		return MakeServerResponseData.Ok<FetchLogsResponse>(data);
	}

	switch (response.status) {
		case 400:
			const err = await response.json();
			return MakeServerResponseData.Error<string>(err.message);
		case 401:
			return MakeServerResponseData.Error<string[]>(["Não autorizado."]);
		default:
			locals.logger.error(
				"Falha ao buscar dados no endpoint de logs (/logs/list): " + (await response.text()),
			);
			return MakeServerResponseData.Error<string[]>(["Não foi possível carregar os registros."]);
	}
}

async function fetchStatistics({
	fetch,
	locals,
}: ServerLoadEvent): Promise<ServerResponseData<FetchStatisticsResponse, string>> {
	const response = await fetch(`${env.BACKEND_URL}/statistics/count`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${locals.accessToken}`,
		},
	});

	if (response.ok) {
		const data: FetchStatisticsResponse = await response.json();
		return MakeServerResponseData.Ok(data);
	}

	locals.logger.error(
		`Falha ao buscar dados no endpoint "/statistics/count". Erro: ` + (await response.text()),
	);
	return MakeServerResponseData.Error("Não foi possível carregar as estatísticas do site.");
}
