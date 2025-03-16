import type { Tag } from "./tag";

export type Post = {
	id: string;
	title: string;
	slug: string;
	topstory: string;
	tags: Tag[];
	description: string;
	createdAt: Date;
	publishedAt?: string | Date | null;
};
