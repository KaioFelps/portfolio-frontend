// See https://kit.svelte.dev/docs/types#app

import type { Logger } from "winston";
import type { AuthUser } from "./core/entities/authUser";
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			accessToken: string | undefined;
			user: AuthUser | undefined;
			logger: Logger;
		}
	}
}

export {};
