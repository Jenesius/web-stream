<template>
    <div class = "room-panel-item" :class = "{'room-panel-item_active': active}">
        <icon :name = "name"/>
    </div>
</template>

<script setup lang = "ts">
    import Icon from "@/components/icon/icon.vue";

    defineProps<{
        name: string,
        active: boolean
    }>()


</script>

<style scoped>
    .room-panel-item{
        height: 100%;
        display: grid;
        place-content: center;
        cursor: pointer;

        padding: 0 23px;
        transition: 0.1s background-color;
    }
    .room-panel-item_active{
        background-color: var(--area-bold);
        color: var(--primary);
    }
    .room-panel-item:hover{
        background-color: var(--area-sub);
    }

</style>
