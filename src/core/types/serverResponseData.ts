export type ServerResponseData<T, E> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: E;
	  };
