<template>
    <div class = "widget-group">

        <div class = "widget-group__main">
            <widget-group-header title="СПБГТУ “ЛЭТИ”" count-members="25"/>
            <widget-group-chat/>
        </div>

        <div class = "widget-group__size"></div>

    </div>
</template>

<script>
    import WidgetGroupChat from "./widget-group-chat";
    import WidgetGroupHeader from "@/components/group/widget-group-header";
    export default {
        name: "widget-group",
        components: {WidgetGroupHeader, WidgetGroupChat}
    }
</script>

<style scoped>
    .widget-group{
        display: grid;
        grid-template-columns: 1fr 300px;
        grid-template-rows: 1fr;

        height: 100%;
        padding: 0 20px;
    }
    .widget-group__main{
        display: grid;
        grid-template-rows: min-content 1fr;
    }
</style>
