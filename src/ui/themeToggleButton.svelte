<script lang="ts">
    import Sun from "phosphor-svelte/lib/Sun"
    import MoonStars from "phosphor-svelte/lib/MoonStars"
    import {scale, fly} from "svelte/transition"
    import {backIn} from "svelte/easing"
    
    let theme: string = "";

    function toggleMode() {
        if (localStorage.kaiofelps_theme === "dark") {
            document.documentElement.classList.remove('dark')
            localStorage.setItem("kaiofelps_theme", "light")
            theme = "light"
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem("kaiofelps_theme", "dark")
            theme = "dark"
        }
    }

</script>

<button on:click={toggleMode} class="rounded-full border-gray-300 dark:border-d-gray-300 border w-[46px] h-[46px] relative">
    {#if theme === "light"}
        <div transition:scale class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Sun size="{24}" weight="bold" />
        </div>
    {:else}
        <div transition:scale class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MoonStars size="{24}" weight="bold" />
        </div>
    {/if}
</button> 