<script lang="ts">
	import Trash from "phosphor-svelte/lib/Trash";
	import AlertDialog from "$crate/components/alert-dialog";
	import { enhance } from "$app/forms";

	export let projectId: string;
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
				Você quer apagar o projeto?
			</AlertDialog.Title>
			<AlertDialog.Description class="text-sm text-foreground-alt">
				Esta é uma ação irreversível. O projeto será permanentemente removido dos registros. Tem
				certeza de que deseja apagar o projeto de ID "{projectId}"?
			</AlertDialog.Description>
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
</AlertDialog.Root>
