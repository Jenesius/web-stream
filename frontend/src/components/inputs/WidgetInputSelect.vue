<template>
    <div class = "wrap-input-select">

        <div class = "relative-container__input-select"
             :class = "{'relative-container_active': active}"
        >
            <div class = "widget-input-select"
                 :class = "{'widget-input-select_active': active}"
            >

                <div class = "input-select__content" @click = "setActive()">
                    <p class = "input-select__content-title">{{title}}</p>
                    <icon name = "caret-down" class = "input-select__content-caret"
                        :class = "{'input-select__content-caret_active': active}"
                    />
                </div>

                <div class = "input-select__list">
                    <p
                        v-for="elem in array" :key = "elem.value"
                        class = "list-item"
                        :class = "{'list-item_active': elem.value === modelValue}"

                        @click = "input(elem.value), setActive(false)"
                    >{{elem.title}}</p>
                </div>

            </div>
        </div>


    </div>
</template>

<script setup lang = "ts">
import Icon from "@/components/icon/icon.vue";
import {computed, ref} from "vue";

const props = defineProps<{
    array: {
        value: any,
        title: string
    }[],
    modelValue: any,
    placeholder?: string
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', v: any): void
}>()

function input(v:any) {
    emit('update:modelValue', v);
}
const title = computed(() => {

    if (props.modelValue === null) return props.placeholder || '';

    return props.array.find(e => e.value === props.modelValue)?.title;

})
function setActive(v = !active.value){
    active.value = v;
}
const active = ref(false);

</script>

<style scoped>
    .relative-container__input-select{
        height: 30px;
        max-height: 30px;
        position: relative;
    }
    .widget-input-select{


        background-color: white;
        border: 1px solid #e7e7e7;
        border-radius: 4px;
        overflow: hidden;
        max-height: 30px;
        transition: 0.2s max-height;
    }
    .widget-input-select_active{
        max-height: 140px;
    }

    .input-select__content{
        display: flex;

        height: 30px;

        cursor: pointer;
        align-items: center;
        padding: 0 5px;

    }
    .input-select__content-title{
        flex-grow: 1;
        font-size: 15px;
        color: #4f4f4f;
    }
    .input-select__content-caret{
        font-size: 16px;
        line-height: 16px;
        user-select: none;
        transition: 0.1s transform;
    }
    .list-item{
        cursor: pointer;
        padding: 0 5px;
        font-size: 15px;
        line-height: 28px;
    }
    .list-item:hover{
        background-color: #f7f7f7;
    }
    .list-item_active{
        background-color: #f8f9fe !important;
    }

    .input-select__content-caret_active{
        transform: rotate(180deg);
    }
    .relative-container_active{
        z-index: 1;
    }
</style>
