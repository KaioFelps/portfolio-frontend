import type { Actions, PageServerLoad } from "./$types";
import { BlogHandlers } from "$crate/handlers/blog";

export const load: PageServerLoad = BlogHandlers.loadAllPosts;

export const actions: Actions = {
	fetchMore: BlogHandlers.fetchMorePosts,
};
