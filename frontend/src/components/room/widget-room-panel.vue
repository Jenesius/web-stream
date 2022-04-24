<template>
    <div class = "widget-room-panel">

        <icon
            v-for = "(item, index) in array"
            :key = "index"

            :name = "item.icon"
            @click = "item.callback"

            :active = "item.active"
        />

        <icon name ="phone-slash" class = "room-panel__exist"/>

    </div>
</template>

<script setup lang = "ts">

    import {MediaManager}
        from "@/assets/js/media-manager";
    import {computed} from "vue";
    import {useStore} from "vuex";
    import Icon from "@/components/icon/icon.vue";

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

        border: 1px solid var(--color-dark-primary);
        border-radius: 7px;
        overflow: hidden;
    }
    .widget-room-panel>i{
        width: 66px;
        height: 100%;
        display: grid;
        place-content: center;
        cursor: pointer;
    }
    .widget-room-panel>i[active="true"] {
        background-color: var(--color-dark-primary);
        color: var(--color-main);
    }
    .widget-room-panel>i:hover{
        background-color: var(--color-light-secondary);
    }
    .widget-room-panel>i[active="true"]:hover{
        background-color: var(--color-dark-secondary);
    }
    .room-panel__exist{
        color: red;
    }
</style>
