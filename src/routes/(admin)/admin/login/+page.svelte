<script lang="ts">
	import { enhance } from "$app/forms";
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Blob from "$crate/assets/orange-blob.svg";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	let formIsLoading = false;
</script>

<img src={LogoDark} alt="Kaio Felps" class="absolute top-4 left-4" />

<div
	class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[calc(100%_-_48px)] max-w-[500px]"
>
	<h1 class="font-bold text-2xl text-white mb-6 text-center">Acessar o dashboard</h1>

	<form
		action="?/login"
		method="post"
		use:enhance={() => {
			formIsLoading = true;

			return async ({ update }) => {
				formIsLoading = false;
				update();
			};
		}}
		class="rounded-3xl bg-d-gray-100 px-8 py-12 gap-3 shadow-lg shadow-black/40"
	>
		<span class="text-xl text-d-gray-800 font-bold leading-none mb-6 block">Faça login</span>

		{#if form?.success}
			<span class="alert success mb-3 sm">Logado com sucesso!</span>
		{/if}

		{#if Array.isArray(form?.errors)}
			<div>
				{#each form.errors as error}
					<span class="alert danger mb-1 last:mb-3 sm">{error}</span>
				{/each}
			</div>
		{/if}

		{#if form?.errors?.email}
			{#each form.errors.email as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}
		<FloatingGroup class="mb-3">
			<FloatingInput type="email" class="w-full" name="email" placeholder="e-mail" />
			<FloatingLabel>E-mail</FloatingLabel>
		</FloatingGroup>

		{#if form?.errors?.password}
			{#each form.errors.password as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}
		<FloatingGroup class="mb-6">
			<FloatingInput type="password" class="w-full" name="password" placeholder="senha" />
			<FloatingLabel>Senha</FloatingLabel>
		</FloatingGroup>

		<button type="submit" disabled={formIsLoading} class="btn default w-full">
			{formIsLoading ? "Fazendo login..." : "Acessar o painel"}
		</button>
	</form>
</div>

<div
	style="background-image: url({Blob})"
	class="absolute inset-x-0 bottom-0 h-[40vh] bg-[center_top] bg-no-repeat bg-cover -z-50"
/>
