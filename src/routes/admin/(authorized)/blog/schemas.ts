import { z } from "zod";

export const postSchema = z.object({
	title: z.string().min(1, "Título precisa ter 1 caractere, no mínimo."),
	description: z.string().min(1, "Preview/Descrição precisa ter 1 caractere, no mínimo."),
	topstory: z.string().url("A imagem de capa precisa ser um link válido (com protocólo incluso)."),
	content: z.string({ message: "Impossível publicar um post sem conteúdo." }),
	tags: z.array(z.string().uuid()).min(1, "O projeto precisa ter no mínimo 1 tag."),
});

export const togglePostVisibilitySchema = z.object({
	id: z.string().uuid(),
});
