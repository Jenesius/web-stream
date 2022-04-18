<template>
    <div>
        <div class = "group__content"></div>
        <widget-group-user-list class = "group__user-list" :group-id = "id"/>

        <widget-group-room-list />
    </div>
</template>

<script setup lang = "ts">
    import WidgetGroupUserList from "@/components/group/widget-group-user-list.vue";
    import {useRoute} from "vue-router";
    import {computed} from "vue";
    import WidgetGroupRoomList
        from "@/components/group/widget-group-room-list.vue";

    const route = useRoute();
    const id = computed(() => route.params.id);

</script>

<style scoped>

</style>
