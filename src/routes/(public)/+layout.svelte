<script lang="ts">
	import Header from "$crate/ui/header.svelte";
	import Footer from "$crate/ui/footer.svelte";
	import MobileHeader from "$crate/ui/mobileHeader.svelte";
</script>

<div class="h-full flex flex-col">
	<Header />
	<MobileHeader />
	<slot />
	<Footer />
</div>
