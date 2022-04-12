<template>
    <div class = "widget-room-panel">
        <widget-room-panel-item
            v-for = "(item, index) in array"
            :key = "index"

            :name = "item.icon"
            @click = "item.callback"
            :active = "item.active"
        />
    </div>
</template>

<script setup lang = "ts">

    import WidgetRoomPanelItem
        from "@/components/room/widget-room-panel-item.vue";
    import {MediaManager}
        from "@/assets/js/media-manager";
    import {computed} from "vue";
    import {useStore} from "vuex";

    const store = useStore();

    const array = computed(() => [
        {
            icon: 'microphone',
            callback: () => MediaManager.microphone(),
            active: store.state.MediaModule.credentials["user-audio"]
        },
        {
            icon: 'video-camera',
            callback: () => MediaManager.camera(),
            active: store.state.MediaModule.credentials["user-video"]
        },
        {
            icon: 'screen',
            callback: () => MediaManager.screen(),
            active: store.state.MediaModule.credentials["display-video"]
        }
    ]);

</script>

<style scoped>
    .widget-room-panel{
        display: flex;
        height: 45px;

        align-items: center;
        border: 1px solid #C2C1C1;
        border-radius: 7px;
        overflow: hidden;
    }
</style>
