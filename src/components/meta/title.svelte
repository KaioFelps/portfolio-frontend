<script lang="ts">
	import { resolveTitle } from ".";

	type Props = {
		title?: string;
		adminRoute?: boolean;
	};

	const { title, adminRoute }: Props = $props();
	const resolvedTitle = resolveTitle({ title, adminRoute });
</script>

<title>{resolvedTitle}</title>

{#if !adminRoute}
	<meta name="application-name" content={resolvedTitle} />
	<meta property="og:title" content={resolvedTitle} />
	<meta property="og:site_name" content={resolvedTitle} />
	<meta name="twitter:title" content={resolvedTitle} />
{/if}
