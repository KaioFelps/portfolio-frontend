<script lang="ts">
	import { Collapsible } from "bits-ui";
	import type { AuthUser } from "$crate/core/entities/authUser";
	import { UserRoleEnum } from "$crate/core/entities/userRoleEnum";
	import Book from "phosphor-svelte/lib/Book";
	import Briefcase from "phosphor-svelte/lib/Briefcase";
	import User from "phosphor-svelte/lib/User";
	import Tag from "phosphor-svelte/lib/Tag";
	import Plus from "phosphor-svelte/lib/Plus";
	import Minus from "phosphor-svelte/lib/Minus";
	import { slide } from "svelte/transition";

	export let user: AuthUser;
	$: isAdmin = user.role === UserRoleEnum.admin;

	const triggersClasses =
		"group w-full px-6 py-4 border-b border-white/10 flex items-center justify-between font-bold text-base text-white data-[state='open']:bg-black/15 transition-all duration-100 will-change-[background] hover:bg-black/10 active:bg-black/20 cursor-default";
	const itemsClasses =
		"pl-14 pr-6 py-4 border-b border-white/10 font-bold text-base text-white hover:bg-black/10 hover:text-white/80 cursor-default active:text-white/70 transition-all duration-100";
</script>

<Collapsible.Root>
	<!-- Projects -->
	<Collapsible.Trigger class={triggersClasses}>
		<span class="flex items-center gap-3">
			<span class="text-yellow-500"><Briefcase size="20" weight="bold" /></span> Portfólio
		</span>
		<span class="text-yellow-500 group-data-[state='open']:hidden">
			<Plus size="20" weight="bold" />
		</span>
		<span class="text-yellow-500 group-data-[state='closed']:hidden">
			<Minus size="20" weight="bold" />
		</span>
	</Collapsible.Trigger>
	<Collapsible.Content
		class="flex flex-col items-stretch"
		transition={slide}
		transitionConfig={{ duration: 200 }}
	>
		<a class={itemsClasses} href="/admin/projetos">Lista de projetos</a>
		<a class={itemsClasses} href="/admin/projetos/novo">Novo projeto</a>
	</Collapsible.Content>
</Collapsible.Root>

<!-- Blog -->
<Collapsible.Root>
	<Collapsible.Trigger class={triggersClasses}>
		<span class="flex items-center gap-3">
			<span class="text-yellow-500"><Book size="20" weight="bold" /></span> Blog
		</span>
		<span class="text-yellow-500 group-data-[state='open']:hidden">
			<Plus size="20" weight="bold" />
		</span>
		<span class="text-yellow-500 group-data-[state='closed']:hidden">
			<Minus size="20" weight="bold" />
		</span>
	</Collapsible.Trigger>
	<Collapsible.Content
		class="flex flex-col items-stretch"
		transition={slide}
		transitionConfig={{ duration: 200 }}
	>
		<a class={itemsClasses} href="/admin/blog">Lista de posts </a>
		<a class={itemsClasses} href="/admin/blog/novo">Novo post</a>
	</Collapsible.Content>
</Collapsible.Root>

<!-- Users -->
<Collapsible.Root>
	<Collapsible.Trigger class={triggersClasses}>
		<span class="flex items-center gap-3">
			<span class="text-yellow-500"><User size="20" weight="bold" /></span> Usuários
		</span>
		<span class="text-yellow-500 group-data-[state='open']:hidden">
			<Plus size="20" weight="bold" />
		</span>
		<span class="text-yellow-500 group-data-[state='closed']:hidden">
			<Minus size="20" weight="bold" />
		</span>
	</Collapsible.Trigger>
	<Collapsible.Content
		class="flex flex-col items-stretch"
		transition={slide}
		transitionConfig={{ duration: 200 }}
	>
		<a class={itemsClasses} href="/admin/users">Lista de usuários</a>
		{#if isAdmin}
			<a class={itemsClasses} href="/admin/users/novo/">Novo usuário</a>
		{/if}
	</Collapsible.Content>
</Collapsible.Root>

<!-- Tags -->
<Collapsible.Root>
	<Collapsible.Trigger class={triggersClasses}>
		<span class="flex items-center gap-3">
			<span class="text-yellow-500"><Tag size="20" weight="bold" /></span> Tags
		</span>
		<span class="text-yellow-500 group-data-[state='open']:hidden">
			<Plus size="20" weight="bold" />
		</span>
		<span class="text-yellow-500 group-data-[state='closed']:hidden">
			<Minus size="20" weight="bold" />
		</span>
	</Collapsible.Trigger>
	<Collapsible.Content
		class="flex flex-col items-stretch"
		transition={slide}
		transitionConfig={{ duration: 200 }}
	>
		<a class={itemsClasses} href="/admin/tags">Tags existentes</a>
		<a class={itemsClasses} href="/admin/tags/novo/">Criar tag</a>
	</Collapsible.Content>
</Collapsible.Root>
