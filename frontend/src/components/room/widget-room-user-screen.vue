<template>
    <div class= "user-screen">
        <p>UserId {{connection.clientId}}}</p>
        <video ref = "refVideo" width="320" height="240" autoPlay muted />
    </div>
</template>

<script setup lang = "ts">

    import RTCConnection from "@/assets/js/rtc-connection";
    import {onMounted, onUnmounted, ref} from "vue";

    const props = defineProps<{
        connection: RTCConnection
    }>()

    const refVideo = ref(null);

    function test(user: RTCConnection) {
        let m = new MediaStream();

        const videoTrack = user.tracks.find(track => track.kind === 'video');

        if (videoTrack) m.addTrack(videoTrack);


        if (refVideo.value)
        {
            refVideo.value.srcObject = m;
            refVideo.value.oncanplay = () => {
                refVideo.value.play()
            }
        }


    }



    const offUpdate = props.connection.on(RTCConnection.EVENT_TRACKS_UPDATE, () => {
        setTimeout(() => {
            test(props.connection);
        }, 0)
    })

    onMounted(() => {
        test(props.connection);
    })
    onUnmounted(() => {
        offUpdate()
    })

</script>

<style scoped>

</style>
