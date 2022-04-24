<template>
    <div class = "group-chat">
        <div class = "group_chat__messages">
            <widget-chat-message
                text = "Привет"
                time="15:30"
            />
            <widget-chat-message
                text = "Пойдём каточку в доточку?"
                time="15:30"
            />
            <widget-chat-message
                text = "Нет. Я физику буду делать!"
                time="15:30"
                type = "primary"
            />
        </div>
        <widget-group-input/>
    </div>
</template>

<script>

    import WidgetGroupInput from "@/components/group/widget-group-input";
    import WidgetChatMessage from "@/components/chat/widget-chat-message";
    export default {
        name: "widget-group-chat",
        components: {WidgetChatMessage, WidgetGroupInput}
    }
</script>

<style scoped>
    .group_chat__messages{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .group-chat{
        display: grid;
        grid-template-rows: 1fr min-content;
    }

</style>
