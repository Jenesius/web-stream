<template>
    <div class = "container-users-invite">

        <div class = "users-invite__search flex gap_10">
            <widget-input
                class = "flex_grow"
                v-model = "search"
                placeholder = "Введите пользователя"
            />
            <widget-loader/>
        </div>

        <div class = "users-invite__result">
            <p
                class = "users-invite__result-item text_sm"

                v-for = "user in arraySearch"
                :key = "user.id"
                @click = "toggleUser(user)"
            >{{user.username}}</p>
        </div>

        <div class = "users-invite__select">
            <span
                class = "users-invite__select-item"
                v-for = "user in state.selected"
                :key = "user.id"

                @click = "toggleUser(user)"
            >{{user.username}}</span>
        </div>

    </div>
</template>

<script setup lang="ts">
    import WidgetInput from "../inputs/WidgetInput.vue";
    import WidgetLoader from "../widget-loader.vue";
    import {reactive, ref, watch} from "vue";
    import useProgress from "@/assets/js/hooks/use-progress";
    import UserService from "@/assets/js/services/user-service";

    const props = defineProps<{
        users: string[]
    }>()

    const emit = defineEmits<{
        (e: 'update:users', data: any): void
    }>()

    const progress = useProgress(onSearch)

    const search = ref('');
    const arraySearch = ref([]);

    const selectedArray = ref([]);

    const state = reactive<{
        selected: any[]
    }>({
        selected: []
    })


    watch(() => search.value, () => {
        onSearch()
    })

    function toggleUser(user: any) {

        const userId = user.id;

        console.log(userId)

        const index = state.selected.findIndex(u => u.id === userId)

        if (index === -1) state.selected.push(user)
        else state.selected.splice(index, 1)


        emit('update:users', state.selected.map(u => u.id));
    }

    function onSearch() {
        return UserService.getList()
        .then(arr => {
            arraySearch.value = arr;
        })
    }

</script>

<style scoped>
    .container-users-invite{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .users-invite__search{
        align-items: center;
    }
    .users-invite__result{
        max-height: 200px;
        overflow: auto;
    }
    .users-invite__result-item{
        padding: 5px 0;
        cursor: pointer;
        color: var(--text-color-secondary)
    }
    .users-invite__result-item:hover{
        background-color: #fcfcfc;
    }
    .users-invite__select{
        display: flex;
        flex-wrap: wrap;
        gap: 10px 5px;
        line-height: 18px;
    }
    .users-invite__select-item{
        color: #505152;
        padding: 2px 6px;
        border-radius: 6px;

        background-color: #f0f0f0;
        cursor: pointer;
    }

    .users-invite__select-item:hover{
        background-color: #f7e4e4;
    }
</style>
