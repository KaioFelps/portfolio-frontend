import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies, locals }) => {
	if (locals.accessToken) {
		cookies.delete("refresh_token", { path: "/" });
		locals.user = undefined;
		locals.accessToken = undefined;
		return redirect(302, "/admin/login");
	}
};
