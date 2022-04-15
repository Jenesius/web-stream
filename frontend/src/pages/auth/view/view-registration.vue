<template>
    <div class = "view-registration">

        <div>
            <p class = "text_sm text_color_secondary">Email</p>
            <widget-input v-model = "values.email"/>
        </div>

        <div>
            <p class = "text_sm text_color_secondary">Пароль</p>
            <widget-input password v-model = "values.password"/>
        </div>

        <div>
            <p class = "text_sm text_color_secondary">Подтверждение пароля</p>
            <widget-input password v-model = "values.confirmPassword"/>
        </div>

        <div class = "view-registration__buttons">
            <button class = "button button_primary button_md">
                <span>Создать</span>
            </button>
        </div>

    </div>
</template>

<script setup lang = "ts">
    import WidgetInput from "@/components/inputs/WidgetInput.vue";
    import {reactive} from "vue";

    const values = reactive({
        password: '',
        email: '',
        confirmPassword: ''
    })

</script>

<style scoped>

    .view-registration{
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px 0;
    }
    .view-registration__buttons{
        display: flex;
        flex-direction: column;
    }
</style>
