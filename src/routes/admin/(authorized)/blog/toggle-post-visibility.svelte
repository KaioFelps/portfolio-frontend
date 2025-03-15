<script lang="ts">
	import { enhance } from "$app/forms";
	import Switch from "$crate/components/switch.svelte";
	import clsx from "clsx";

	type Props = {
		postId: string;
		publishedAt?: Date | null;
	};

	const { postId, publishedAt }: Props = $props();

	let isPublished = $derived(!!publishedAt);

	let formElement: HTMLFormElement | undefined = $state();
	let formIsLoading = $state(false);
	$effect(() => {
		console.log(formIsLoading);
	});

	function getFormattedPublishedDate(date?: Date | null) {
		if (!date) return "Não publicado";
		const formattedDate = date.toLocaleString("pt-BR", {
			timeZone: "America/Sao_Paulo",
			dateStyle: "medium",
		});
		console.log("data formatada: " + formattedDate);
		return formattedDate;
	}
</script>

<form
	method="post"
	action="?/toggleVisibility"
	bind:this={formElement}
	use:enhance={({ formData }) => {
		console.log(formData);
		formIsLoading = true;

		return async ({ update }) => {
			formIsLoading = false;
			await update();
		};
	}}
>
	<input readonly type="hidden" value={postId} name="id" />
	<Switch
		title="Alternar visibilidade do post"
		forceDarkMode
		checked={isPublished}
		disabled={formIsLoading}
		onCheckedChange={() => {
			formElement?.requestSubmit();
		}}
	/>
</form>

<span class={clsx(formIsLoading && "animate-pulse")}>
	{#if formIsLoading}
		Alterando visibilidade...
	{:else}
		{getFormattedPublishedDate(publishedAt)}
	{/if}
</span>
