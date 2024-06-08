<script lang="ts">
	import Header from "@/ui/header.svelte";
	import Footer from "@/ui/footer.svelte";
	import MobileHeader from "@/ui/mobileHeader.svelte";
</script>

<div class="h-full flex flex-col">
	<Header />
	<MobileHeader />
	<slot />
	<Footer />
</div>
