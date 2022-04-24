<template>
    <div class = "chat-message" :class="`chat-message__${type}`">
        <p class = "chat-message__text">{{text}}</p>
        <span class = "chat-message__time">{{time}}</span>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        text: string,
        time: string,
        type?: number
    }>()
</script>

<style scoped>
    .chat-message{
        padding: 4px 22px 12px 4px;
        border-radius: 6px;
        position: relative;
        background-color: var(--color-dark-secondary);
        border: 2px solid var(--color-dark-secondary);
        color: var(--color-light-primary);
        min-width: 160px;
        max-width: 60%;
        width: fit-content;
    }
    .chat-message__primary{
        background-color: var(--color-light-primary);
        color: var(--color-dark-primary);
    }
    .chat-message__text{
    }
    .chat-message__time{
        position: absolute;
        right: 0;
        bottom: 0;
        font-weight: 300;
        font-size: 12px;
        line-height: 14px;
    }
</style>
