<template>
  <video
    ref="videoRef"
    :preload="preloadMeta"
    :autoplay="isAutoplay"
    :muted="isMuted"
    :playsinline="isPlaysInLine"
    :loop="isLoop"
    :class="classes"
  >
    <slot />
  </video>
</template>


<script setup>
const {
  preloadMeta,
  isAutoplay,
  isMuted,
  isPlaysInLine,
  isLoop,
  classes,
  isSwiper,
  threshold,
} = defineProps([
  "preloadMeta",
  "isAutoplay",
  "isMuted",
  "isPlaysInLine",
  "isLoop",
  "classes",
  "isSwiper",
  "threshold"
]);
const videoRef = ref(null);
onMounted(() => {
  if (videoRef.value) {
    playPauseVideo();
  }
});

function playPauseVideo() {
  let thresholdvalue = 0.3 // Play when 30% of the player is visible.
  // We can only control playback without insteraction if video is mute
  videoRef.value.muted = true;
  if (threshold) {
    thresholdvalue = Number(threshold)
  }
  // Play is a promise so we need to check we have it
  let playPromise = videoRef.value.play();
  if (playPromise !== undefined) {
    playPromise.then((_) => {
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio !== 1 && !videoRef.value.paused) {
              videoRef.value.pause();
              // console.log('pausedddd')
              // console.log(videoRef.value)
            } else if (videoRef.value.paused) {
              videoRef.value.play();
            }
          });
        },
        { threshold: thresholdvalue }
      );
      observer.observe(videoRef.value);
    });
  }
}
</script>