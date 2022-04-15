<template>
    <div class = "app-auth">
        <widget-auth-container
            :title = state.title
            :info = state.info
            :link = "state.route.link"
            :link-title = "state.route.title"
        >
            <router-view/>
        </widget-auth-container>
    </div>

    <widget-modal-container/>

</template>

<script setup lang = "ts">
    import WidgetAuthContainer
        from "@/pages/auth/components/WidgetAuthContainer.vue";
    import {useRoute} from "vue-router";
    import {computed} from "vue";
    import {container as WidgetModalContainer} from "jenesius-vue-modal";

    const route = useRoute();



    const isRegistration = computed(() => route.name ==='registration');

    const state = computed(() => {

        if (!isRegistration.value) return {
            title: 'Вход',
            info : 'С Возвращением!',
            route : {
                title: 'Регистрация',
                link : { name: 'registration' }
            }
        }

        return {
            title: 'Регистрация',
            info : 'Создание нового пользователя.',
            route : {
                title: 'Вход',
                link : { name: 'login' }
            }
        }

    })



</script>

<style scoped>
    @import "./../../assets/css/index.css";

    .app-auth{
        height: 100vh;
        display: grid;
        place-content: center;
        grid-template-columns: minmax(200px, 350px);
    }

</style>
