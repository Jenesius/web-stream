<template>
    <div class = "navigation-new-group" >
        <div>
            <icon name = "add" class = "navigation-new-group__icon"/>
        </div>
    </div>
</template>

<script>
    import Icon from "../icon/icon";
    export default {
        name: "interface-navigation-new-group",
        components: {Icon}
    }
</script>

<style scoped>
    .navigation-new-group{
        display: grid;
        place-content: center;
        aspect-ratio: 1 / 1;
        cursor: pointer;
    }
    .navigation-new-group__icon{
        font-size: 22px;
        color: var(--text-color-primary);
    }
    .navigation-new-group:hover .navigation-new-group__icon{
        color: var(--primary);
    }
</style>
