<template>
    <div class = "widget-room-header">
        <p class = "widget-room-header__title">{{title}}</p>
        <span>{{time}}</span>
    </div>
</template>

<script setup lang = "ts">

    import prettyTime from "@/assets/js/pretty-time";
    import {computed} from "vue";

    const props = defineProps<{
        title: string,
        duration: number
    }>()

    const time = computed(() => {

        const seconds = Math.floor(props.duration / 1000);

        return prettyTime(seconds);
    })

</script>

<style scoped>
    .widget-room-header{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ededed;
        padding: 15px 5px;
    }
    .widget-room-header__title{
        font-size: 18px;
        line-height: 24px;
        flex-grow: 1;
    }
</style>
