<template>
    <div class = "user-list-item flex">
        <div class = "user-list-item__photo"></div>
        <p class = "user-list-item__name">{{username}}</p>
    </div>
</template>

<script setup lang = "ts">

    defineProps<{
        username: string,
    }>()

</script>

<style scoped>
    .user-list-item{
        gap: 10px;
        align-items: center;
    }
    .user-list-item__photo{
        height: 30px;
        width: 30px;
        background-color: #f0f0f0;
        border-radius: 50%;
    }
</style>
