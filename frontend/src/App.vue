<template>
    <router-view/>

    <modal-container/>
</template>

<script setup lang = "ts">
    import {MediaManager} from "@/assets/js/media-manager";
    import {useStore} from "vuex";
    import {container as ModalContainer} from "jenesius-vue-modal"


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
