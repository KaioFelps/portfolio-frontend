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

export function resolveCanonicalUrl(base: string, location?: string) {
	if (!location) return base;

	if (!location.startsWith("/")) location = "/" + location;
	if (base.endsWith("/")) base = base.substring(0, base.length - 1);

	return base + location;
}

export default {
	Root,
	Title,
	Description,
	Card,
	Image,
};
