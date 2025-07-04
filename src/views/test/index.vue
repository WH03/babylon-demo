<template>
    <div>

        <div id="fullscreenElement" ref="fullscreenElement"
            style="width: 100%; height: 300px; background-color: lightgray;">
            这是一个可以全屏的元素
            <button class="btn" @click="toggleFullscreen">切换全屏</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import screenfull from 'screenfull';
const fullscreenElement = ref(null);


const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
        screenfull.toggle(fullscreenElement.value);
    }
};


onMounted(() => {

})

</script>

<style scoped lang="scss">
#fullscreenElement {
    overflow: auto;
    position: relative;

    .btn {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>