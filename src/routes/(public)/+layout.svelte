<script lang="ts">
    import Header from "@/ui/header.svelte";
    import Footer from "@/ui/footer.svelte";
</script>

<div class="h-full flex flex-col">
    <Header />
    <slot />
    <Footer/>
</div>