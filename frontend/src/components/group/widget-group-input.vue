<template>
    <div class = "chat-input">
        <input class = "chat-textarea" type = "text"/>
        <div class = "chat-buttons">
            <icon class = "chat-button__send" name = "paper-plane"/>
        </div>
    </div>
</template>

<script>
    import Icon from "@/components/icon/icon";
    export default {
        name: "widget-group-input",
        components: {Icon}
    }
</script>

<style scoped>
    .chat-input{
        display: grid;
        grid-template-columns: 1fr min-content;
        gap: 10px;

        padding: 15px 20px 40px 20px;
    }
    .chat-textarea{
        height: 35px;
        border-radius: 4px;
        border: 2px solid var(--color-dark-secondary);
        font-size: 16px;
        padding: 0 10px;
    }
    .chat-buttons{
        display: flex;
        align-items: center;
    }
    .chat-buttons>*{
        cursor: pointer;
    }
    .chat-button__send{
        padding: 0 10px;
        font-size: 18px;

        transition: 150ms transform;
    }
    .chat-button__send:active{
        transform: translateX(7px);
    }
</style>
