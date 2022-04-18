<template>
    <div class = "room-list">

        <div class = "room-list__header">
            <p>Комнаты</p>
        </div>

        <div>

        </div>

        <div class = "room-list__bottom">
            <widget-button
                class = "button_primary button_md"
                :callback = "onCreate"
            >
                Создать
            </widget-button>
        </div>

    </div>
</template>

<script setup lang = "ts">

import WidgetButton from "@/components/widget-button.vue";
import {openModal} from "jenesius-vue-modal";
import ModalNewRoom from "@/components/modals/modal-new-room.vue";

    function onCreate() {
        openModal(ModalNewRoom)
    }

</script>

<style scoped>
    .room-list{
        display: flex;
        flex-direction: column;
        padding: 7px;
        border: 1px solid #dfe1e5;
        border-radius: 10px;
        gap: 10px;
    }
</style>
