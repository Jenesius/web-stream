<template>
    <div class = "room-cards" :class = "{'room-card_fullscreen-item': fullscreenConnectionId}" ref = "refContainer">

        <div class = "room-cards__fullscreen" v-if = "fullscreenConnectionId">
            <widget-room-user-screen
                class = "room-cards__fullscreen-item"
                :user="activeConnection"
                :active = "true"
                @fullscreen = "onFullScreen(null)"
            />
        </div>

        <div
            class = "room-cards__list"
            :class = "{'room-card__list_short': fullscreenConnectionId}"
        >
            <widget-room-user-screen
                v-for="user in filterArray"
                :key = "user.connection.clientId"
                :user = "user"

                @fullscreen = "onFullScreen(user.connection.clientId)"
            />
        </div>

    </div>
</template>

<script setup lang = "ts">

    import RTCConnection from "@/assets/js/rtc-connection";
    import WidgetRoomUserScreen
        from "@/components/room/widget-room-user-screen.vue";
    import {computed, ref} from "vue";

    import useRoomCards from "./../../assets/js/hooks/use-room-cards";
    import {UserConnectionInfo} from "@/assets/js/types/user-types";
    const props = defineProps<{
        users: {connection: RTCConnection, userInfo: UserConnectionInfo}[],
    }>()

    const [fullscreenConnectionId, onFullScreen] = useRoomCards()

    const filterArray = computed(() => {
        return props.users.filter(c => c.connection.clientId !== fullscreenConnectionId.value)
    })

    const activeConnection = computed(
        () => props.users.find(c => c.connection.clientId === fullscreenConnectionId.value)
    );

    const refContainer = ref<HTMLElement>();








</script>

<style scoped>

    .room-cards{
        /*
        width: 100%;

         */
        gap: 10px;
        height: 100%;

    }
    .room-cards__list{
        display: grid;
        justify-content: center;

        gap: 10px;
        grid-template-columns: repeat(auto-fit, 500px);
        grid-template-rows: 200px;
    }
    .room-card__list_short{
        grid-template-columns: 1fr;
        grid-auto-rows: max-content;
    }
    .room-cards__fullscreen{
        display: grid;

        /*
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;

         */
    }

    .room-card_fullscreen-item{
        display: grid;
        grid-template-columns: 1fr 20%;
    }
    .room-cards__fullscreen-item{
        width: 100%;
        height: 100%;
    }

</style>
