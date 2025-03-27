<script lang="ts">
	type Props = {
		/** This is a large summary card. The image should follow 16:4 proportion or similar. */
		url: string;
	};

	const { url }: Props = $props();
</script>

<meta name="twitter:card" content={url} />
