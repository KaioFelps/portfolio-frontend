import type { Actions } from "@sveltejs/kit";
import { TagsActionsHandlers } from "./handlers";

export const actions: Actions = {
	create: async (ctx) => await TagsActionsHandlers.createTag.bind(ctx)(),
	edit: async (ctx) => await TagsActionsHandlers.editTag.bind(ctx)(),
};
