<template>
    <div class = "widget-room">

        <widget-room-header :title = "`Room ${id}`" :duration = "duration"/>


        <div class = "widget-room-user-screen">

            <widget-room-cards :connections = "users" />

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


    const route = useRoute();
    const id = computed(() => route.params.id);


    const users = ref<RTCConnection[]>([]);
    const duration = ref(0);
    const startDuration = new Date();

    watch(() => id.value, async () => {

        if (!id.value) return;

        const timer = setInterval(() => {

            duration.value = (new Date()).getTime() - startDuration.getTime();

        }, 1000)

        document.title = `Room ${id.value}`

        const room = new Room();

        const offRoomUpdate = room.on('update', () => {
            users.value = Object.values(room.connections)
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
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 10px;
        width: 100%;
    }
    .widget-room-user-screen{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        flex-grow: 1;
        gap: 10px;
        justify-content: center;
        padding: 10px 0;
    }
    .widget-room__container-panel{
        padding: 100px 0;
        display: grid;
        justify-content: center;
    }

</style>
