<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import type { CreateTagResponse } from "../../novo/handlers";

	export let form: CreateTagResponse;
	let formIsLoading = false;

	if (!form.success && !form.internalError && !form.error.validation) {
		form.error.data;
	}
</script>

<h1 class="mb-12">Criar tag</h1>

{#if form && form.success}
	<span class="success alert mb-3 py-2"> Tag criada com sucesso! </span>
{:else if form && !form.internalError && form.error}
	<span class="danger alert mb-3 py-2">{form.error}</span>
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
	{#if !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.value ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{:else if !form.success && !form.internalError && !form.error.validation}
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
