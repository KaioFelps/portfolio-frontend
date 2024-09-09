import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { TagsActionsHandlers } from "./handlers";

export const load: PageServerLoad = async (ctx) => await TagsActionsHandlers.load.bind(ctx)();

export const actions: Actions = {
	edit: async (ctx) => await TagsActionsHandlers.edit.bind(ctx)(),
};
