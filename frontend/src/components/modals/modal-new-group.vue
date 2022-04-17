<template>
    <div class = "modal-wrap flex-column gap_10">

        <h3 class = "modal-wrap__title">Новая группа</h3>

        <div class = "modal-wrap__body">

            <div>
                <p class = "text_sm text_color_secondary">Название</p>
                <widget-input v-model = "values.name"/>
            </div>

            <div>

                <p class = "text_sm text_color_secondary">Приглашения</p>
                <widget-users-invite v-model:users = "inviteUsers"/>
            </div>



            <widget-button
                class = "button_md button_primary"
                :callback = "onCreate">Создать</widget-button>
        </div>

    </div>
</template>

<script setup lang = "ts">
    import WidgetInput from "../inputs/WidgetInput.vue";
    import {reactive, ref} from "vue";
    import WidgetButton from "@/components/widget-button.vue";
    import WidgetUsersInvite
        from "@/components/users-invite/widget-users-invite.vue";
    import GroupService from "@/assets/js/services/group-service";
    import {useRouter} from "vue-router";
    import {closeModal} from "jenesius-vue-modal";

    const values = reactive({
        name: ''
    })

    const router = useRouter();

    const inviteUsers = ref([]);

    function onCreate() {

        return GroupService.create({
            name: values.name,
            invites: inviteUsers.value
        }).then(({groupId}) => {

            router.push({name: 'group', params: {id: groupId}})

            closeModal()
        })



    }

</script>

<style scoped>
    .modal-wrap__title{
        margin: 0;
    }
</style>
