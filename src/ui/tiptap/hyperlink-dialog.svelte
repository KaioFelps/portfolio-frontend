<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import { flyAndScale } from "$crate/utils";
	import { Popover } from "bits-ui";
	import { Checkbox } from "bits-ui";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import EditorButton from "./editor-button.svelte";
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import Check from "phosphor-svelte/lib/Check";
	import clsx from "clsx";

	const { editor }: { editor: Editor } = $props();

	let open = $state(false);
	let isHyperLink: boolean = $state(false);
	let isExternal: boolean = $state(false);
	let linkURL: string = $state("");
	let error: string | null = $state(null);

	const handleColorPickOpen = () => {
		linkURL = editor.getAttributes("link").href ?? "";
		isExternal = editor.getAttributes("link").target === "_blank";
	};

	$effect(() => {
		(true || open) && (isHyperLink = editor.isActive("link"));
	});

	const handleUnsetLink = () => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
		open = false;
	};

	const handleSetLink = () => {
		try {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: linkURL, target: isExternal ? "_blank" : "_self" })
				.run();
			open = false;
		} catch (_error: any) {
			error = _error.message;
		}
	};
</script>

<Popover.Root bind:open onOpenChange={handleColorPickOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<EditorButton {...props} active={isHyperLink} class={open ? "bg-white/20" : null}>
				<LinkSimple size="20" weight="bold" />
			</EditorButton>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		align="start"
		sideOffset={8}
		alignOffset={0}
		class="max-w-[calc(100%-_48px)] min-w-[300px] dropdown p-3"
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div {...props} transition:flyAndScale>
						<span class="block font-bold mb-4">
							{#if isHyperLink}Editar{:else}Editar{/if} Hyperlink
						</span>

						{#if error}
							<span class="danger alert mb-3 py-2">
								{error}
							</span>
						{/if}

						<FloatingGroup class="mb-3">
							<FloatingInput
								bind:value={linkURL}
								oninput={() => (error = null)}
								class="w-full"
								name="hyperlink"
								placeholder="https://www.kaiofelps.dev"
								type="text"
							/>
							<FloatingLabel>URL</FloatingLabel>
						</FloatingGroup>

						<label
							id="external-label"
							for="external"
							class="my-4 flex items-center gap-3 select-none cursor-pointer group"
						>
							<Checkbox.Root
								id="external"
								aria-labelledby="terms-label"
								class={clsx(
									"form-control peer inline-flex p-0 size-[25px] items-center justify-center",
									"data-[state=checked]:bg-yellow-500 transition-all duration-150",
								)}
								bind:checked={isExternal}
							>
								{#snippet children({ checked, indeterminate })}
									<div
										class="inline-flex items-center justify-center pointer-events-none text-black"
									>
										{#if checked}
											<Check class="size-[16px]" weight="bold" />
										{/if}
									</div>
								{/snippet}
							</Checkbox.Root>

							<span
								class="font-medium text-white/60 peer-data-[state=unchecked]:hover:text-white/70 peer-data-[state=checked]:text-white transition-color duration-150"
							>
								Link externo
							</span>
						</label>

						<hr class="bg-d-gray-300 h-[1px] border-none w-full my-3" />

						<div class="flex items-center gap-2">
							{#if isHyperLink}
								<button onclick={handleUnsetLink} type="button" class="btn ghost btn-xs"
									>Remover</button
								>
							{/if}

							<button class="btn default btn-xs" onclick={handleSetLink}>Salvar</button>
						</div>
					</div>
				</div>
			{/if}
		{/snippet}
	</Popover.Content>
</Popover.Root>
