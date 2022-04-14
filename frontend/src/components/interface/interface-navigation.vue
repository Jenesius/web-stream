<template>
    <div class = "interface-navigation">
        <div class = "interface-navigation__logo">
            <p>Logo</p>
        </div>

        <div class = "interface-navigation__body"></div>

        <interface-navigation-user/>

    </div>
</template>

<script setup lang = "ts">
    import InterfaceNavigationUser from "./interface-navigation-user.vue";

</script>

<style scoped>
    .interface-navigation{
        display: flex;
        flex-direction: column;
        background-color: white;
    }
    .interface-navigation__body{
        flex-grow: 1;
    }
</style>
