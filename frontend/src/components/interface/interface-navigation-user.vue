<template>
    <div class = "navigation-user-wrap">
        <icon class = "icon__user" name = "user"/>
    </div>
</template>

<script setup>

import Icon from "@/components/icon/icon";
</script>

<style scoped>
    .icon__user{
        font-size: 22px;
        transition: 0.2s transform;
        color: var(--color-dark-primary);
    }
    .navigation-user-wrap{
        padding: 10px 0;
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    .navigation-user-wrap:hover .icon__user{
        transform: translateY(-7px);
    }


</style>
