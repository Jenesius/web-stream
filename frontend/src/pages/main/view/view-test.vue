<template>
    <div class = "view-test">

        <widget-users-invite v-model:users = "array"/>

        {{array}}
    </div>
</template>

<script setup lang="ts">

    import {ref} from "vue";

    const array = ref([]);


import WidgetUsersInvite from "@/components/users-invite/widget-users-invite.vue";
</script>

<style scoped>
    .view-test{
        height: 100%;
        width: 100%;
        background-color: white;
    }


</style>
