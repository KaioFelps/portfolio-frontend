import { BlogHandlers } from "$crate/handlers/blog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = BlogHandlers.getPostBySlug;
