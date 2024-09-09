import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { ProjectsActionsHandlers } from "./handlers";

export const load: PageServerLoad = async (ctx) => await ProjectsActionsHandlers.load.bind(ctx)();

export const actions: Actions = {
	publish: async (ctx) => await ProjectsActionsHandlers.publish.bind(ctx)(),
};
