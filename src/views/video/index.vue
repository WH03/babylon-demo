<!-- <template>
    <div>
        <video muted="muted" controls width="600" height="600" style="width:50%; height:50%" ref="videoRef"></video>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import flvjs from 'flv.js';
let videoRef = ref(null);

let flvPlayer;

let url = 'rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream';

onMounted(() => {
    if (flvjs.isSupported()) {
        console.log(videoRef.value);
        const videoElement = videoRef.value.video;
        flvPlayer = flvjs.createPlayer(
            {
                type: "flv",
                // isLive: false,
                // hasAudio: false,
                url: "ws://localhost:8888/" + url,
            },
            {
                cors: true, // 是否跨域
                // enableWorker: true, // 是否多线程工作
                enableStashBuffer: false, // 是否启用缓存
                // stashInitialSize: 128, // 缓存大小(kb)  默认384kb
                autoCleanupSourceBuffer: true, // 是否自动清理缓存
                fixAudioTimestampGap: false, //false才会音视频同步
            }
        );
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        // 报错重连
        flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
            console.log("errorType:", errType);
            console.log("errorDetail:", errDetail);
            play();
        });
    }
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
</style> -->

<!-- <template>
    <div id="video-box" class="video-item" v-show="showFlag">
        <video id="my-video" class="video-js vjs-default-skin" controls preload="auto" style="width: 100%;height:100%">
            <source id="source" :src="xxxx视频请求网址xxxx" type="application/x-mpegURL" />
        </video>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'video.js/dist/video-js.css';

const myPlayer = ref(null);
const initVideo = () => {
    //初始化配置
    myPlayer.value = videojs('my-video', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true,
    });
    // 播放
    myPlayer.value.play();
};

onMounted(() => {
    setTimeout(() => {
        initVideo();
    }, 300);
});
</script>

<style lang="scss" scoped></style> -->

<template>
    <div class="video-container">
        <video ref="videoRef" controls autoplay muted class="video-player"></video>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Hls from 'hls.js'

const videoRef = ref(null)
const hlsStreamUrl = 'http://192.168.2.45:8080/hls/stream.m3u8' // 你的 HLS 地址

onMounted(() => {
    if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(hlsStreamUrl)
        hls.attachMedia(videoRef.value)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.value.play()
        })
    } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari 原生支持 HLS
        videoRef.value.src = hlsStreamUrl
        videoRef.value.addEventListener('loadedmetadata', () => {
            videoRef.value.play()
        })
    }
})
</script>

<style scoped>
.video-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.video-player {
    width: 100%;
    height: auto;
    background: black;
    border-radius: 8px;
}
</style>