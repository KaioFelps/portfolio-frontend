import { z } from "zod";

export const editTagSchema = z.object({
	_id: z.string().uuid("O Id da tag é inválido."),
	value: z
		.string({ message: "O valor é um campo obrigatório." })
		.min(1, "O valor da tag precisa ter, no mínimo, 1 dígito."),
});
