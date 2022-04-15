<template>
    <div class = "view-test">

        <div>
            <widget-button class = "button_md button_primary">Google</widget-button>
        </div>

        <div class = "view-test-container view-test-full">
            <div class = "h4"></div>
        </div>

        <div class = "view-test-container view-test-list">
            <div class = "h1"></div>
            <div class = "h2"></div>
            <div class = "h1"></div>
            <div class = "h2"></div>
            <div class = "h3"></div>
            <div class = "h3"></div>
            <div class = "h2"></div>
            <div class = "h1"></div>
            <div class = "h3"></div>
            <div class = "h2"></div>
        </div>
    </div>
</template>

<script>
    import WidgetButton from "@/components/widget-button";
    export default {
        name: "view-test",
        components: {WidgetButton}
    }
</script>

<style scoped>
    .view-test{
        height: 100%;
        width: 100%;

        display: grid;
        grid-template-columns: 80% 20%;

    }

    .view-test-full{
        background-color: blanchedalmond;
    }
    .view-test-list{
        background-color: gray;
    }
    .view-test-container>div{
        width: 100%;
        height: auto;
    }
    .h3{

    }
</style>
