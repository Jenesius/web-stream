<template>
    <div class = "view-test">

    </div>
</template>

<script setup lang="ts">

    import useSocket from "@/assets/js/use-socket/use-socket";

    const socket = useSocket({namespace: 'rooms'})

    socket.on('connect', () => {

        console.log('++')
        socket.emit('room:join', {roomId: 1});

    })


</script>

<style scoped>
    .view-test{
        height: 100%;
        width: 100%;
        background-color: white;
    }


</style>
