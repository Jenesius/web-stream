<template>
    <div class = "room-preset">

        <div class = "room-preset__body">

            <div>
                <p>Ваше имя</p>
                <widget-input v-model = "state.nickname"/>
            </div>

            <div>
                <p>Запись</p>
                <widget-input-select
                    :array = "arrayAudioInput"
                    v-model = "state.audioinput"
                    placeholder="Войти без микрофона"
                />
            </div>

            <div>
                <p>Вывод</p>
                <widget-input-select
                    :array = "arrayAudioOutput"
                    v-model = "state.audiooutput"
                />
            </div>
        </div>

        <div class = "room-preset__bottom">

            <button class = "button_main button_md" @click = "handleClick">Подключиться</button>

        </div>

    </div>
</template>

<script setup lang = "ts">
    import WidgetInput from "@/components/inputs/WidgetInput.vue";
    import {computed, onMounted, reactive} from "vue";
    import WidgetInputSelect from "@/components/inputs/WidgetInputSelect.vue";
    import {useStore} from "vuex";

    const store = useStore();

    const emit = defineEmits<{
        (e: 'ready', config: any): void
    }>()

    const state = reactive({
        nickname: '',
        audioinput: null,
        audiooutput: null
    })

    const test = [
        {
            value: '1',
            title: 'Value 1'
        },{
            value: '2',
            title: "hello World"
        },{
            value: '3',
            title: "Can u get mu number?"
        }
    ]
    function handleClick() {

        emit('ready', state)
    }

    const arrayAudioInput = computed(() => store.state.MediaModule.devices.audioinput.map((d: MediaDeviceInfo) => ({value: d.deviceId, title: d.label})))
    const arrayAudioOutput= computed(() => store.state.MediaModule.devices.audiooutput.map((d: MediaDeviceInfo) => ({value: d.deviceId, title: d.label})))


    onMounted(async () => {

        store.dispatch("MediaModule/UPDATE_DEVICES");

    })

</script>

<style scoped>
    .room-preset__bottom{
        padding: 14px 8px;
    }
    .room-preset__body{
        display: flex;
        flex-direction: column;

        gap: 15px;
    }
</style>
