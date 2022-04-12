<template>
    {{isReady}}
    <widget-room v-if = "isReady"/>
</template>

<script setup lang = "ts">

    import {openModal} from "jenesius-vue-modal";
    import ModalConnectRoom from "@/components/modals/modal-connect-room.vue";
    import AudioSystem from "@/assets/js/audio-system";
    import {computed, onMounted, ref} from "vue";
    import WidgetRoom from "@/components/room/widget-room.vue";
    import {useRoute} from "vue-router";

    const isReady = ref(false);

    const route = useRoute();
    const id = computed(() => route.params.id)


    onMounted(() => {
        openModal(ModalConnectRoom, {
            id: id.value,
            callback:async () => {
                isReady.value = true;
                await AudioSystem.init();
            }
        })
    })



</script>

<style scoped>

</style>
