<template>
    <div class = "widget-group">

        <div class = "widget-group__main">
            <widget-group-header title="СПБГТУ “ЛЭТИ”" count-members="25"/>
            <widget-group-chat/>
        </div>


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
        padding: 20px;
        display: grid;
        grid-template-columns: minmax(400px, 800px) 300px;
        grid-template-rows: 1fr;

        height: 100%;
    }
    .widget-group__main{
        display: grid;
        grid-template-rows: 60px 1fr;
    }
</style>
