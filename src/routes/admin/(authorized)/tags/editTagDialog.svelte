<script lang="ts">
	import type { Tag } from "$crate/core/entities/tag";
	import type { EditTagResponse } from "./handlers";
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import AlertDialog from "$crate/components/alert-dialog";
	import Pencil from "phosphor-svelte/lib/Pencil";

	export let tag: Tag;
	export let form: EditTagResponse | undefined;
	let open = false;
	let formIsLoading = false;

	$: if (form && form.success) {
		open = false;
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class="text-white">
		<Pencil size="20" weight="bold" />
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<div class="flex flex-col gap-4 pb-6">
			<AlertDialog.Title class="text-lg font-semibold tracking-tight">
				Editando a tag {tag.value}
			</AlertDialog.Title>
		</div>
		<div class="flex w-full items-end justify-center gap-2">
			<form
				action="?/edit"
				method="post"
				class="w-full"
				use:enhance={() => {
					formIsLoading = true;
					return async ({ update }) => {
						update({ reset: false });
						formIsLoading = false;
					};
				}}
			>
				<input type="hidden" name="_id" value={tag.id} />

				<FloatingGroup class="mb-4">
					<FloatingInput class="w-full" type="text" disabled value={tag.id} />
					<FloatingLabel>ID</FloatingLabel>
				</FloatingGroup>

				{#if form && !form.success && !form.internalError && form.error.validation}
					{#each form.error.data.fieldErrors.value ?? [] as error}
						<span class="alert danger mb-2 mt-4 sm">{error}</span>
					{/each}
				{/if}
				<FloatingGroup class="mb-4">
					<FloatingInput
						class="w-full"
						name="value"
						placeholder="Rust"
						type="text"
						value={tag.value}
					/>
					<FloatingLabel>Tag</FloatingLabel>
				</FloatingGroup>

				<div class="flex gap-2 items-center">
					<AlertDialog.Cancel class="btn ghost">Cancelar</AlertDialog.Cancel>
					<button class="btn default" type="submit" disabled={!tag.id || formIsLoading}>
						{#if formIsLoading}
							Editando
						{:else}
							Editar
						{/if}
					</button>
				</div>
			</form>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
