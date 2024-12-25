<script lang="ts">
	import { onMount } from "svelte";

	type $$Props = {
		title?: string;
		adminRoute?: boolean;
	};

	export let title: string | undefined = undefined;
	export let adminRoute: boolean = false;

	$: formattedTitle = getFormattedTitle(adminRoute, title);

	const getFormattedTitle = (isAdminRoute: boolean, title?: string) => {
		const formerPart = isAdminRoute ? "Kaio Felps :: Admin" : "Kaio Felps";
		return title ? `${formerPart} | ${title}` : formerPart;
	};

	onMount(() => {
		return () => {
			document.head.querySelectorAll("title")?.forEach((title) => title.remove());
		};
	});
</script>

<title>{formattedTitle}</title>
