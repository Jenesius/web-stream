<template>
    <div class = "container-interface">
        <interface-size class = "container-interface__size" />

        <div class = "container-interface__main">
            <router-view/>
        </div>
    </div>
</template>

<script setup lang = "ts">

import InterfaceSize from "@/components/interface/interface-navigation.vue";
</script>

<style scoped>
    .container-interface{
        display: grid;
        grid-template-columns: 80px 1fr;
    }
    @media screen and (min-width: 960px) {
        .container-interface{
            position: sticky;
            top: 0;
            height: 100vh;
        }
    }
    .container-interface__main{
        display: flex;
        flex-direction: column;
        min-height: 100vh;

    }
</style>
