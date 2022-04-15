<template>
    <div class = "auth-container">
        <div class = "auth-container__header">
            <h3 class = "auth-container__title">{{title}}</h3>
            <router-link :to="link" class = "text-link">{{linkTitle}}</router-link>
        </div>
        <p class = "auth-container__info">{{info}}</p>

        <slot/>

        <p class = "auth-container__text-separate text_sm text_color_secondary">или</p>
        <div class = "auth-container__bottom">
            <button class = "button button_light button_md">
                <img src = "@/assets/icon/google-logo.svg" alt = "123"/>
                <span>Google</span>
            </button>
        </div>

    </div>
</template>

<script setup lang = "ts">

    import {RouteLocationRaw} from "vue-router";

    const props = defineProps<{
        title: string,
        info: string,
        link:RouteLocationRaw,
        linkTitle: string
    }>()

</script>

<style scoped>
    .auth-container{
        width: 100%;
        display: flex;
        flex-direction: column;

        border: 1px solid #dfe1e5;
        border-radius: 10px;
        padding: 15px;
    }
    .auth-container__header{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .auth-container__title{
        font-size: 24px;
        line-height: 32px;
        margin: 8px 0;

        color: var(--text-color-primary);
    }
    .auth-container__info{
        color: var(--text-color-secondary);
        font-size: 17px;
    }
    .auth-container__bottom{
        display: grid;
    }
    .auth-container__text-separate{
        margin-bottom: 15px;
        text-align: center;
    }
</style>
