import Card from "./card.svelte";
import Description from "./description.svelte";
import Image from "./image.svelte";
import Root from "./root.svelte";
import Title from "./title.svelte";

type ResolveTitleArgs = {
	title: string;
	adminRoute?: boolean;
};

export function resolveTitle({ title, adminRoute = false }: ResolveTitleArgs) {
	const getFormattedTitle = (isAdminRoute: boolean, title?: string) => {
		const formerPart = isAdminRoute ? "Kaio Felps :: Admin" : "Kaio Felps";
		return title ? `${formerPart} :: ${title}` : formerPart;
	};

	const formattedTitle = $derived(getFormattedTitle(adminRoute, title));
	return formattedTitle;
}

export default {
	Root,
	Title,
	Description,
	Card,
	Image,
};
