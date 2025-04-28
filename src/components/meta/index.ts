import Card from "./card.svelte";
import Description from "./description.svelte";
import Image from "./image.svelte";
import Root from "./root.svelte";
import Title from "./title.svelte";

type ResolveTitleArgs = {
	title?: string;
	adminRoute?: boolean;
};

export function resolveTitle({ title, adminRoute = false }: ResolveTitleArgs) {
	const formerPart = adminRoute ? "Kaio Felps :: Admin" : "Kaio Felps";
	return title ? `${formerPart} :: ${title}` : formerPart;
}

export default {
	Root,
	Title,
	Description,
	Card,
	Image,
};
