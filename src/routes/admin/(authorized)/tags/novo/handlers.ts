import { z } from "zod";
import type { RequestEvent } from "@sveltejs/kit";
import { MakeServerResponseData } from "$crate/core/helpers/server-action-response";
import { fail, type ActionFailure } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { ServerResponseData } from "$crate/core/types/server-response-data";
import type { ResponseErrorType } from "$crate/core/types/response-error";

const createTagSchema = z.object({
	value: z.string().min(1, "Tag precisa ter 1 caracter no mínimo."),
});

type CreateResponseError = ResponseErrorType<typeof createTagSchema, string[]>;

export type CreateTagResponse = ServerResponseData<{}, CreateResponseError>;

export abstract class TagsActionsHandlers {
	public static async createTag(
		this: RequestEvent,
	): Promise<ActionFailure<CreateTagResponse> | CreateTagResponse> {
		const formData = await this.request.formData();
		const parsedData = createTagSchema.safeParse(Object.fromEntries(formData));

		if (!parsedData.success)
			return fail(
				400,
				MakeServerResponseData.Error<CreateResponseError>({
					validation: true,
					data: parsedData.error.flatten(),
				}),
			);

		const body = JSON.stringify(parsedData.data);
		const response = await this.fetch(`${env.BACKEND_URL}/tag/new`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body,
		});

		if (response.ok) return MakeServerResponseData.Ok({});

		if (response.status === 400) {
			const res = await response.json();
			return fail(
				400,
				MakeServerResponseData.Error<CreateResponseError>({
					validation: false,
					data: res.message as string[],
				}),
			);
		}

		return fail(
			500,
			MakeServerResponseData.Error<CreateResponseError>({
				validation: false,
				data: ["Não foi possível criar a tag."],
			}),
		);
	}
}
