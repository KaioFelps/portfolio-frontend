<!-- <script lang="ts">
	import Trash from "phosphor-svelte/lib/Trash";
	import AlertDialog from "$crate/components/alert-dialog";
	import { enhance } from "$app/forms";

    export let tag: string;
	export let tagId: string;
	let open = false;
	let formIsLoading = false;
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class="text-red-600">
		<Trash size="20" weight="bold" />
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<div class="flex flex-col gap-4 pb-6">
			<AlertDialog.Title class="text-lg font-semibold tracking-tight">
				Editando a tag {tag}
			</AlertDialog.Title>
		</div>
		<div class="flex w-full items-end justify-center gap-2">
			<AlertDialog.Cancel class="btn ghost">Cancelar</AlertDialog.Cancel>
			<form
				action="?/delete"
				method="post"
				use:enhance={() => {
					formIsLoading = true;
					return async ({ update }) => {
						formIsLoading = false;
						open = false;
						update();
					};
				}}
			>
				<input type="hidden" name="project_id" value={projectId} />
				<button class="btn danger" type="submit" disabled={!projectId || formIsLoading}>
					{#if formIsLoading}
						Apagando
					{:else}
						Apagar
					{/if}
				</button>
			</form>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root> -->
