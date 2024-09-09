export type ServerResponseData<T, E> =
	| {
			success: true;
			data: T;
	  }
	| { success: false; internalError: true }
	| {
			success: false;
			internalError: false;
			error: E;
	  };
