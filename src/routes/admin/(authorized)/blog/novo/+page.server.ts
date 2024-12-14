import { BlogActionsHandlers } from "../handlers";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (ctx) => await BlogActionsHandlers.load.bind(ctx)();
