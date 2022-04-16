<template>



    <button class = "button widget-button">

        <div class = "widget-button__side">
            <icon :name = "icon"/>
            <widget-loader/>
        </div>


        <span>
            <slot/>
        </span>

    </button>
</template>

<script setup lang = "ts">
    import Icon from "./icon/icon.vue";
    import WidgetLoader from "@/components/widget-loader.vue";
    import useProgress from "@/assets/js/hooks/use-progress";

    const props = defineProps<{
        icon?: string,
        callback?: any
    }>()

    let progressWrap = useProgress(props.callback);



</script>

<style scoped>
    .widget-button{
        position: relative;
    }
    .widget-button__side{
        padding: 10px;
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
    }
</style>
