<template>
    <widget-room v-if = "isReady" :nickname = "nickname" />
    <widget-room-preset v-else @ready = "onReady"/>
</template>

<script setup lang = "ts">

    import {ref} from "vue";
    import WidgetRoom from "@/components/room/widget-room.vue";
    import WidgetRoomPreset from "@/components/room/widget-room-preset.vue";

    const isReady = ref(false);

    const nickname = ref<string | undefined>('');

    function onReady(data: {nickname?: string, audioinput?: string, audiooutput?: string}) {

        nickname.value = data.nickname;
        isReady.value = true;
    }

</script>

<style scoped>

</style>
