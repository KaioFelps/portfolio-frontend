import { Jsonable } from "./jsonable";

export class ServerActionResponse<S, E = string> extends Jsonable {
	constructor(
		public data: S | null,
		public error: E | null,
	) {
		super();
	}
}
