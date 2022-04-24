<template>
    <div class = "interface-navigation">

        <div class = "interface-navigation__separator"></div>

        <div class = "interface-navigation__logo">
            <img alt="logo" src = "./../../assets/icon/logo.svg"/>
        </div>

        <div class = "interface-navigation__body">
            <interface-navigation-group-list/>

        </div>

        <interface-navigation-new-group @click = "openMasterGroup" />

        <interface-navigation-user/>

    </div>
</template>

<script setup lang = "ts">
    import InterfaceNavigationUser from "./interface-navigation-user.vue";
    import InterfaceNavigationNewGroup
        from "@/components/interface/interface-navigation-new-group.vue";
    import ModalNewGroup from "@/components/modals/modal-new-group.vue";
    import {openModal} from "jenesius-vue-modal";
    import InterfaceNavigationGroupList
        from "@/components/interface/interface-navigation-group-list.vue";

    function openMasterGroup() {
        openModal(ModalNewGroup);
    }

</script>

<style scoped>
    .interface-navigation{
        display: flex;
        flex-direction: column;
        background-color: white;
        position: relative;
    }
    .interface-navigation__body{
        flex-grow: 1;
    }
    .interface-navigation__logo{
        padding: 20px 0;
    }
    .interface-navigation__logo>img{
        height: 50px;
    }
    .interface-navigation__separator{
        position: absolute;
        right: 0;
        width: 2px;
        height: 97%;
        margin: auto;
        top: 0;
        bottom: 0;
        background-color: var(--color-dark-primary);
    }
</style>
