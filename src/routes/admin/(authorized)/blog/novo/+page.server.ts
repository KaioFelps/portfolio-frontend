import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BlogActionsHandlers } from "../handlers";

export const load: PageServerLoad = async (ctx) =>
	await BlogActionsHandlers.loadNewBlogPostPageData.bind(ctx)();

export const actions: Actions = {
	publish: async (ctx) => await BlogActionsHandlers.publish.bind(ctx)(),
};
