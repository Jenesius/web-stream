<template>
    <div class = "group-header">
        <img class = "group-header__icon" src = "./../../assets/icon/leti-logo.svg" alt = "group-logo">
        <h3 class = "group-header__title">{{title}}</h3>
        <p class = "group-header__count-members">{{countMembers}} участников</p>

        <div>

            <widget-button class = "button_sm button_primary" @click = "open">Подключиться</widget-button>

        </div>

    </div>
</template>

<script setup lang="ts">

    import WidgetButton from "@/components/widget-button.vue";
    import ModalConnectRoom from "@/components/modals/modal-connect-room.vue";

    import {openModal} from "jenesius-vue-modal";
    import {useRouter} from "vue-router";

    const props = defineProps<{
        countMembers: number,
        title: string
    }>()

    const router = useRouter();

    function open() {
        openModal(ModalConnectRoom, {
            callback: () => {
                router.push({name: 'room', params: {id: 1}})
            }
        })
    }

</script>

<style scoped>
    .group-header{
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 15px 0;
    }
    .group-header__icon{
        height: 40px;
    }
    .group-header__title{
        margin: 0;
        color: var(--color-dark-primary);
        font-size: 26px;
    }
    .group-header__count-members{
        color: var(--color-dark-secondary);
    }
</style>
