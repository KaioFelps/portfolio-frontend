<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import type { CreateTagResponse } from "./handlers";

	export let form: CreateTagResponse | undefined;
	let formIsLoading = false;
</script>

<h1 class="mb-12">Criar tag</h1>

{#if form?.success}
	<span class="success alert mb-3 py-2"> Tag criada com sucesso! </span>
{/if}

<form
	method="post"
	action="?/create"
	use:enhance={() => {
		formIsLoading = true;

		return async ({ update }) => {
			formIsLoading = false;
			await update();
		};
	}}
>
	{#if form && !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.value ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{:else if form && !form.success && !form.internalError && !form.error.validation}
		{#each form.error.data ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}

	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="value" placeholder="Rust" type="text" />
		<FloatingLabel>Tag</FloatingLabel>
	</FloatingGroup>

	<div class="flex gap-2 mt-4">
		<a href="/admin/projetos" class="btn ghost">Cancelar</a>
		<button type="submit" disabled={formIsLoading} class="btn default">
			{formIsLoading ? "Criando" : "Criar"} tag
		</button>
	</div>
</form>
