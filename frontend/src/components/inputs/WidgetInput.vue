<template>
    <div class = "wrap-input">

        <input type = "text" class = "widget-input"
               :value = "modelValue"
               @input = "$emit('update:modelValue', $event.target.value)" />

    </div>
</template>

<script setup lang = "ts">

    const props = defineProps<{
        modelValue: any
    }>()


</script>

<style scoped>
    .widget-input{
        height: 30px;
        width: auto;

        padding: 0 5px;
        border-radius: 4px;
        border: 1px solid #e7e7e7;
        outline: 0;
        color: #4f4f4f;
    }
    .widget-input:focus{
        border-color: #d4d4d4;
    }
</style>
