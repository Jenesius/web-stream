<template>
    <div class = "view-login">

        <div>
            <p class = "text_sm text_color_secondary">Email</p>
            <widget-input v-model = "values.email"/>
        </div>

        <div>
            <p class = "text_sm text_color_secondary">Пароль</p>
            <widget-input v-model = "values.password"/>
            <p class = "login__text-password text_sm cursor_pointer"
                @click = "openNotRealized"
            > Забыл пароль? </p>
        </div>

        <button class = "button button_md button_primary" @click = "onLogin">
            <span>Войти</span>
        </button>

    </div>
</template>

<script setup lang = "ts">
    import openNotRealized from '@/assets/js/modals';
    import WidgetInput from "@/components/inputs/WidgetInput.vue";
    import Request from "@/assets/js/request";
    import AuthService from "@/assets/js/services/auth-service";

    const values = {
        email: '',
        password: ''
    }

    function onLogin() {
        return AuthService.login()
        .then(() => {
            window.location.replace('/main')
        })
    }

</script>

<style scoped>
    .view-login{
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px 0;
    }
    .login__text-password{
        text-align: right;
        color: var(--primary);
    }
</style>
