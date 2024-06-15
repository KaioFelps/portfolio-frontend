import type { Tag } from "./tag";

export type Post = {
	id: string;
	title: string;
	slug: string;
	topstory: string;
	tags: Tag[];
	preview: string;
	createdAt: Date;
	publishedAt: Date;
};
