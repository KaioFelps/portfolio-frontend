import { z } from "zod";

export type ResponseErrorType<Schema extends z.ZodType, T> =
	| {
			validation: true;
			data: z.inferFlattenedErrors<Schema>;
	  }
	| {
			validation: false;
			data: T;
	  };
