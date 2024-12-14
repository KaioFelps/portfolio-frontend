import type { Tag } from "$crate/core/entities/tag";
import { MakeServerResponseData } from "$crate/core/helpers/serverActionResponse";
import type { PaginatedResponse } from "$crate/core/types/paginatedResponse";
import type { ServerResponseData } from "$crate/core/types/serverResponseData";
import { env } from "$env/dynamic/private";
import type { ServerLoadEvent } from "@sveltejs/kit";

type FetchTagsResponse = PaginatedResponse & { tags: Array<Tag> };

export type PageLoadData = { tags: ServerResponseData<FetchTagsResponse, string> };

export abstract class BlogActionsHandlers {
	public static async load(this: ServerLoadEvent): Promise<PageLoadData> {
		const tagsFetch = await this.fetch(`${env.BACKEND_URL}/tag/list`);

		if (tagsFetch.ok) {
			const data: FetchTagsResponse = await tagsFetch.json();
			return { tags: MakeServerResponseData.Ok<FetchTagsResponse>(data) };
		}

		this.locals.logger.error(
			`Falha aoo buscar tags no endpoint "/tag/list". Err: ` + (await tagsFetch.text()),
		);

		return {
			tags: MakeServerResponseData.Error("Não foi possível carregar as tags disponíveis."),
		};
	}
}
