import type { Tag } from "./tag";

export type ExpandedPost = {
	id: string;
	author: string;
	title: string;
	slug: string;
	tags: Tag[];
	topstory: string;
	content: string;
	createdAt: Date;
	updatedAt: Date | null;
	publishedAt: Date | null;
};
