import { z } from "zod";

export const publishProjectSchema = z.object({
	title: z.string().min(1, "Título precisa ter 1 caractere no mínimo."),
	topstory: z.string().url("A imagem de capa precisa ser um link válido (com protocólo incluso)."),
	links: z.array(
		z.object({
			title: z.string().min(1, "Os títulos dos links precisam ter no mínimo 1 caractere."),
			value: z
				.string()
				.url("Todo valor de link precisa ser uma url válida (com protocólo incluso)."),
		}),
	),
	tags: z.array(z.string().uuid()).min(1, "O projeto precisa ter no mínimo 1 tag."),
});
