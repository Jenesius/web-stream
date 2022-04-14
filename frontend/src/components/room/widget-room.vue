<template>
    <div class = "widget-room">

        <widget-room-header :title = "`Room ${id}`" :duration = "duration"/>


        <div class = "widget-room__body">

            <widget-room-cards :users = "users" />

        </div>


        <div class = "widget-room__container-panel">
            <widget-room-panel />
        </div>
    </div>
</template>

<script setup lang = "ts">
    import {computed, ref, watch} from "vue";
    import {useRoute} from "vue-router";
    import WidgetRoomPanel from "@/components/room/widget-room-panel.vue";
    import Room from "@/assets/js/room";
    import {MediaManager} from "@/assets/js/media-manager";
    import WidgetRoomUserScreen
        from "@/components/room/widget-room-user-screen.vue";
    import RTCConnection from "@/assets/js/rtc-connection";
    import WidgetRoomHeader from "@/components/room/widget-room-header.vue";
    import WidgetRoomCards from "@/components/room/widget-room-cards.vue";


    const props = defineProps<{
        nickname: string
    }>()
    const route = useRoute();
    const id = computed(() => route.params.id);


    const connections = ref<RTCConnection[]>([]);

    let room: Room;

    const users = computed(() => {



        return connections.value.map(c => {

            return {
                connection: c,
                userInfo: room.getUserInfo(c.clientId)
            }

        })

    })
    const duration = ref(0);
    const startDuration = new Date();

    watch(() => id.value, async () => {

        if (!id.value) return;

        const timer = setInterval(() => {

            duration.value = (new Date()).getTime() - startDuration.getTime();

        }, 1000)

        document.title = `Room ${id.value}`

        room = new Room({userInfo: {nickname: props.nickname}});

        // @ts-ignore
        window.room = room;

        const offRoomUpdate = room.on('update', () => {
            connections.value = Object.values(room.connections)
        })

        const offUpdateTrack = MediaManager.onupdateTrack(() => {
            room.recall();
        })

        return () => {
            offRoomUpdate();
            offUpdateTrack();
            room.leave();
            clearInterval(timer)
        }



    }, {
        immediate: true
    })



</script>

<style scoped>
    .widget-room{
        margin: auto;
        max-width: 1400px;
        width: 100%;
        max-height: 100vh;
        height: 100vh;

        --room-size-bottom: 85px;
    }
    .widget-room__body{

        height: calc(100% - 55px - var(--room-size-bottom));
        overflow: auto;
        padding: 10px 0;
    }
    .widget-room__container-panel{
        height: var(--room-size-bottom);
        display: grid;
        justify-content: center;

    }

</style>
