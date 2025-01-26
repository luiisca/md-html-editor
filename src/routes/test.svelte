<script lang="ts">
    let { setCount, count } = $props();
</script>

<button onclick={setCount}>Count: {count}</button>
