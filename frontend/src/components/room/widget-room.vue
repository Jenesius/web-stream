<template>
    <div>
        <p>Room {{id}}</p>


        <widget-room-user-screen
            v-for = "connection in users"
            :key = "connection._index"

            :connection = "connection"
        />

        <widget-room-panel />
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


    const route = useRoute();
    const id = computed(() => route.params.id);


    let room;

    const users = ref<RTCConnection[]>([]);

    watch(() => id.value, async () => {

        if (!id.value) return;




        document.title = `Room ${id.value}`

        room = new Room();

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
        }



    }, {
        immediate: true
    })



</script>

<style scoped>

</style>
