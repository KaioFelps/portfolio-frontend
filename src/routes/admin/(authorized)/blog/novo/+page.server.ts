import type { Actions } from "@sveltejs/kit";
import { BlogActionsHandlers } from "../handlers";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (ctx) => await BlogActionsHandlers.load.bind(ctx)();

export const actions: Actions = {
	publish: async (ctx) => await BlogActionsHandlers.publish.bind(ctx)(),
};
