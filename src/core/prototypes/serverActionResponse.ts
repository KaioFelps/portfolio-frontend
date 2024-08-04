import { Jsonable } from "./jsonable";

export class ServerActionResponse<S, E = string> extends Jsonable {
	constructor(
		public data: S | null,
		public error: E | null,
	) {
		super();
	}
}

export type ServerDataFetchResponse<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
	  };

export abstract class ServerDataFetchResult<T> {
	public static Ok<T>(data: T) {
		return { success: true, data } satisfies ServerDataFetchResponse<T>;
	}

	public static Error<T>(error: string) {
		return { success: false, error } satisfies ServerDataFetchResponse<T>;
	}
}
