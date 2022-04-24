<template>
    <div class = "group-list">

        <div class = "group-item">
            <img src = "./../../assets/icon/google-logo.svg" alt = "test"/>
        </div>
        <div class = "group-item">
            <img src = "./../../assets/icon/google-logo.svg" alt = "test"/>
        </div>
        <div class = "group-item">
            <img src = "./../../assets/icon/google-logo.svg" alt = "test"/>
        </div>
        <div class = "group-item">
            <img src = "./../../assets/icon/google-logo.svg" alt = "test"/>
        </div>

    </div>
</template>

<script>
    export default {
        name: "interface-navigation-group-list"
    }
</script>

<style scoped>
    .group-list{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 13px;
    }
    .group-item{
        display: grid;
        place-content: center;
        height: 42px;
        width: 42px;
        border: 2px solid var(--color-dark-primary);
        border-radius: 50%;

        cursor: pointer;
    }
    .group-item>img{
        max-height: 18px;
        max-width: 26px;
    }
</style>
