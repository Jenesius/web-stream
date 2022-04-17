<template>
    <div class = "user-list">
        <div class = "user-list__header">
            <p>Список участников</p>

        </div>

        <p
            v-for = "user in userArray"
            :key = "user.id"
        >user</p>

    </div>
</template>

<script setup lang = "ts">

    import {ref, watchEffect} from "vue";
    import GroupService from "@/assets/js/services/group-service";
    import useProgress from "@/assets/js/hooks/use-progress";

    const props = defineProps<{
        groupId: string
    }>()

    const userArray = ref([]);

    const progress = useProgress(() => {
        updateUserList(props.groupId);
    })

    async function updateUserList(id: string) {
        if (!id) return;

        console.log(`[user-list] update`);

        userArray.value = GroupService.getMembers(id)

    }

    watchEffect(progress.call.bind(progress))

</script>

<style scoped>

</style>
