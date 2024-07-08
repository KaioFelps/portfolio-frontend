import type { Link } from "./link";
import type { Tag } from "./tag";

export type Project = {
	id: string;
	title: string;
	tags: Tag[];
	links: Link[];
	topstory: string;
	createdAt: Date;
};
