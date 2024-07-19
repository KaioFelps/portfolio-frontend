// See https://kit.svelte.dev/docs/types#app

import type { Logger } from "winston";
// for information about these interfaces
declare global {
	var themeCookieKey: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			accessToken: string | undefined;
			logger: Logger;
		}
	}
}

export {};
