<template>
    <div class= "user-screen">
        <p class = "user-screen__full-name">UserId {{connection.clientId}}}</p>
        <video class = "user-screen__video" ref = "refVideo"  autoPlay muted />

        <div class = "user-screen__bottom">

            <div class = "user-screen__credentials">
                <icon name = "microphone" :class = "{'credential-icon_active': isAudio}"/>
                <icon name = "video-camera" :class = "{'credential-icon_active': isVideo}"/>
            </div>

            <div class = "user-screen__actions">
                <icon name = "expand-arrows-alt" @click = "tt"/>
            </div>

        </div>


    </div>
</template>

<script setup lang = "ts">

    import RTCConnection from "@/assets/js/rtc-connection";
    import {onMounted, onUnmounted, ref, inject} from "vue";
    import Icon from "@/components/icon/icon.vue";
    const props = defineProps<{
        connection: RTCConnection,
        active?: boolean
    }>()
    const emit = defineEmits<{
        (e: 'fullscreen'): void
    }>()
    const refVideo = ref<HTMLVideoElement | null>(null);




    const isAudio = ref(false);
    const isVideo = ref(false);

    function test(user: RTCConnection) {
        let m = new MediaStream();

        const videoTrack = user.tracks.find(track => track.kind === 'video');
        const audioTrack = user.tracks.find(track => track.kind === 'audio');

        isVideo.value = !!videoTrack;
        isAudio.value = !!audioTrack;

        if (videoTrack) {
            m.addTrack(videoTrack);

        }
        if (audioTrack) {
            // m.addTrack(audioTrack);
        }

        if (refVideo.value)
        {
            refVideo.value.srcObject = m;
            refVideo.value.oncanplay = () => {
                if (refVideo.value)
                    refVideo.value.play()
            }
        }


    }

    function tt() {
        emit('fullscreen')
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
    .user-screen{
        position: relative;

        padding: 2px;
        border-radius: 5px;
        background-color: #ebebeb;

    }


    .user-screen__full-name{
        position: absolute;
        padding: 4px;
        background-color: rgb(228 228 228 / 78%);
        border-radius: 3px;
    }
    .user-screen__video{
        border-radius: 3px;
        width: 100%;
        height: 100%;
    }

    .user-screen__bottom{
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;

        display: flex;
        justify-content: space-between;
    }

    .user-screen__credentials{
        display: flex;
        gap: 10px;
        padding: 8px;
        color: gray;
    }
    .user-screen__credentials>i{
        font-size: 12px;
    }
    .credential-icon_active{
        color: var(--primary);
    }

    .user-screen__actions>i {
        cursor: pointer;
        font-size: 16px;
        line-height: 16px;
        padding: 10px;
    }
    .user-screen__actions>i:hover{
        background-color: #cacaca;
    }
</style>
