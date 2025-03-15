import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BlogActionsHandlers } from "./handlers";

export const load: PageServerLoad = async (ctx) =>
	await BlogActionsHandlers.loadBlogPosts.bind(ctx)();

export const actions: Actions = {
	toggleVisibility: (ctx) => BlogActionsHandlers.toggleBlogPostVisibility.bind(ctx)(),
};
