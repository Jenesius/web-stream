<template>
    <div class = "room-preset">

        <div class = "room-preset__body">

            <div>
                <p>Микрофон</p>
                <icon name = "microphone"/>
                <input type="email">
            </div>

        </div>

        <div class = "room-preset__bottom">

            <button class = "button_main button_md" @click = "handleClick">Подключиться</button>

        </div>

    </div>
</template>

<script setup lang = "ts">
    import Icon from "@/components/icon/icon.vue";

    const emit = defineEmits<{
        (e: 'ready', config: any): void
    }>()

    function handleClick() {

        emit('ready', 'data')
    }

</script>

<style scoped>
    .room-preset__bottom{
        padding: 14px 8px;
    }
</style>
