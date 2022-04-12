<template>
    <widget-room/>
</template>

<script setup lang = "ts">
    import WidgetRoom from "@/components/room/widget-room";
    import {MediaManager} from "@/assets/js/media-manager";
    import {useStore} from "vuex";




    const store = useStore()
    // @ts-ignore
    window.store = store;

    MediaManager.onupdateTrack(() => {
        store.commit("MediaModule/UPDATE_CREDENTIALS", MediaManager.getCredentials())
    })

</script>

<style scoped>
    @import "./assets/css/index.css";
</style>
