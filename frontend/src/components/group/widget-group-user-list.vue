<template>
    <div class = "user-list">
        <div class = "user-list__header">
            <p>Список участников</p>

            <widget-loader v-if = "progress.wait"/>

        </div>

        <div>

            <widget-group-user-list-item
                v-for = "user in userArray"
                :key = "user.id"

                :username = "user.username"
            />

        </div>


    </div>
</template>

<script setup lang = "ts">

    import {ref, watchEffect} from "vue";
    import GroupService from "@/assets/js/services/group-service";
    import useProgress from "@/assets/js/hooks/use-progress";
    import WidgetLoader from "@/components/widget-loader.vue";
    import WidgetGroupUserListItem
        from "@/components/group/widget-group-user-list-item.vue";

    const props = defineProps<{
        groupId: string
    }>()

    const userArray = ref([]);

    const progress = useProgress(() => {
        return updateUserList(props.groupId);
    })

    async function updateUserList(id: string) {
        if (!id) return;

        console.log(`[user-list] update`);

        userArray.value = await GroupService.getMembers(id)

    }

    watchEffect(progress.call.bind(progress))

</script>

<style scoped>
    .user-list__header{



    }
    .user-list{
        display: flex;
        flex-direction: column;
        padding: 7px;
        border: 1px solid #dfe1e5;
        border-radius: 10px;
        gap: 10px;
    }
</style>
