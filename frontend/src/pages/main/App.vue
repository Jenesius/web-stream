<template>
    <interface-container>

        <router-view/>
    </interface-container>



    <modal-container/>
</template>

<script setup>
    import {MediaManager} from "@/assets/js/media-manager";
    import {container as ModalContainer} from "jenesius-vue-modal"
    import {useStore} from "vuex";
    import InterfaceContainer from "@/components/interface/interface-container";

    const store = useStore();

    MediaManager.onupdateTrack(() => {
        store.commit("MediaModule/UPDATE_CREDENTIALS", MediaManager.getCredentials())
    })

</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>
