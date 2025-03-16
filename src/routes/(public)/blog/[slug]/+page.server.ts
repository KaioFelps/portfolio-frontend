import { BlogHandlers } from "$crate/handlers/blog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (ctx) => BlogHandlers.getPostBySlug.bind(ctx)();
