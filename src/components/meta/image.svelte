<script lang="ts">
	type Props = {
		/**
		 * This is a ordinary image that will be the cover rendered when the site is embedded, unless it's a cover.
		 * It might be square or rectangular.
		 */
		url: string;
	};

	const { url }: Props = $props();
</script>

<meta property="og:image" content={url} />
<meta property="og:image" content={url} />
