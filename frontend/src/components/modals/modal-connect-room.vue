<template>
    <p> Now u will be connected to room {{id}}</p>
    <button @click = "apply">connect</button>
</template>

<script setup lang = 'ts'>

    import {useRouter} from "vue-router";
    import {closeModal} from "jenesius-vue-modal";

    const props = defineProps<{
        id: string,
        callback: () => void
    }>()

    const router = useRouter();

    function apply() {
        props.callback();
        closeModal();
    }

</script>

<style scoped>

</style>
