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
    import useSocket from "@/assets/js/use-socket/use-socket";

    const store = useStore();

    MediaManager.onupdateTrack(() => {
        store.commit("MediaModule/UPDATE_CREDENTIALS", MediaManager.getCredentials())
    })

    const socket = useSocket({namespace: 'journal'})

    socket.on('connect', e => {

        console.log(`[%csocket-journal%c] connected.`, 'color: green', 'color:black');

        socket.emit('add', "I connect to u")

    })
    socket.on('connect_error', e => {
        console.warn('eerr', e)
    })
    socket.on('disconnect', e => {
        console.log('--')
    })

</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>
