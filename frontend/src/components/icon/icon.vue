<template>
    <i :class = "`fi fi-rr-${name}`"/>
</template>

<script setup lang = "ts">

    const props = defineProps<{
        name?: string
    }>()

</script>

<style scoped>

</style>
