<template>
    <div class = "navigation-user-wrap">
        <div class = "navigation-user">
            <span class = "navigation-user__short-name">Д</span>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .navigation-user{
        background-color: black;
        border-radius: 4px;
        padding: 10px;
        height: 46px;
        width: 46px;
        display: grid;
        place-content: center;
    }
    .navigation-user__short-name{
        color: white;
        font-size: 16px;
        line-height: 16px;
    }
    .navigation-user-wrap{
        padding: 10px 0;
        display: flex;
        justify-content: center;
    }
</style>
