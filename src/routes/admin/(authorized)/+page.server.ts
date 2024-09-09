import type { PageServerLoad } from "./$types";
import { AdminPagesRootActionsHandlers } from "./handlers";

export const load: PageServerLoad = async (ctx) => AdminPagesRootActionsHandlers.load.bind(ctx)();
