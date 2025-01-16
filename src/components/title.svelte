<script lang="ts">
	import { onMount } from "svelte";

	type Props = {
		title?: string;
		adminRoute?: boolean;
	};

	const getFormattedTitle = (isAdminRoute: boolean, title?: string) => {
		const formerPart = isAdminRoute ? "Kaio Felps :: Admin" : "Kaio Felps";
		return title ? `${formerPart} :: ${title}` : formerPart;
	};

	const { adminRoute = false, title }: Props = $props();
	const formattedTitle = $derived(getFormattedTitle(adminRoute, title));

	onMount(() => {
		return () => {
			document.head.querySelectorAll("title")?.forEach((title) => title.remove());
		};
	});
</script>

<title>{formattedTitle}</title>
