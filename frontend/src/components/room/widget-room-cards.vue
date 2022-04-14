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
                :key = "user.connection.id"
                :user = "user"

                @fullscreen = "onFullScreen(user.connection.id)"
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

    const [fullscreenConnectionId, onFullScreen] = useRoomCards(computed(() => props.users))

    const filterArray = computed(() => {
        return props.users.filter(c => c.connection.id !== fullscreenConnectionId.value)
    })

    const activeConnection = computed(
        () => props.users.find(c => c.connection.id === fullscreenConnectionId.value)
    );

    const refContainer = ref<HTMLElement>();








</script>

<style scoped>

    .room-cards{
        /*
        width: 100%;

         */
        gap: 10px;

    }
    .room-cards__list{
        display: grid;
        justify-content: center;

        flex-wrap: wrap;
        gap: 10px;
    }

    .room-cards__list{
        grid-template-columns: repeat(auto-fit, 500px);
    }
    .room-card__list_short{
        grid-template-columns: 1fr;
        grid-auto-rows: max-content;
    }
    .room-cards__fullscreen{
        display: grid;
        align-content: baseline;
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
