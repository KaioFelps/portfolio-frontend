import type { ServerResponseData } from "../types/serverResponseData";

export abstract class MakeServerResponseData {
	public static Ok<T>(data: T) {
		return { success: true, data } satisfies ServerResponseData<T, unknown>;
	}

	public static Error<E>(error: E) {
		return { success: false, error, internalError: false } satisfies ServerResponseData<unknown, E>;
	}

	public static InternalError() {
		return { success: false, internalError: true } satisfies ServerResponseData<unknown, unknown>;
	}
}
