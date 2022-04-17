<template>
    <div class = "wrap-input">

        <div class = "input-block">
            <input :type = "inputType" class = "widget-input"
                   :value = "modelValue"
                   :placeholder="placeholder"
                   @input = "$emit('update:modelValue', $event.target.value)" />

            <div class = "input-block__password">
                <icon
                    class = "input-block__password-icon"
                    v-if = "password"
                    :name = "passwordVisibility?'eye' : 'eye-crossed'"

                    @click = "togglePassword"
                />
            </div>
        </div>


    </div>
</template>

<script setup lang = "ts">

    import {computed, ref} from "vue";
    import Icon from "@/components/icon/icon.vue";

    const props = defineProps<{
        modelValue: any,
        password?: boolean,
        placeholder?: string
    }>()

    const inputType = computed(() =>
        props.password && passwordVisibility.value?'password':'text')

    const passwordVisibility = ref(false);

    const togglePassword = () => passwordVisibility.value = !passwordVisibility.value;

</script>

<style scoped>
    .input-block{
        display: flex;
        border: 1px solid #e7e7e7;
        border-radius: 4px;
    }
    .input-block:focus-within{
        border-color: #d4d4d4;
    }
    .input-block__password{
        padding: 0 10px;
        display: grid;
        place-content: center;
        cursor: pointer;
    }

    .widget-input{
        height: 36px;
        width: 100%;

        padding: 0 5px;

        border: 0;
        outline: 0;
        color: #4f4f4f;
        font-size: 15px;

        background-color: transparent;
    }

</style>
