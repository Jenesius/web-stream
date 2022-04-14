<template>
    <widget-room v-if = "isReady" />
    <widget-room-preset v-else @ready = "onReady"/>
</template>

<script setup lang = "ts">

    import {ref} from "vue";
    import WidgetRoom from "@/components/room/widget-room.vue";
    import WidgetRoomPreset from "@/components/room/widget-room-preset.vue";

    const isReady = ref(false);

    function onReady() {
        isReady.value = true;
    }

</script>

<style scoped>

</style>
