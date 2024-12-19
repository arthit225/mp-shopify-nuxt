<template>
  <div class="spotify-player relative" id="spotify-player">
    <span class='pulse-button'>Live</span>
    <iframe :src="url" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  </div>
</template>

<script setup>
const route = useRoute();
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories/global-elements/footer", {
  version: version,
});
const footerState = reactive({ story: data.story });
const url = footerState.story.content.spotify_playlist_url;
</script>

<style lang="scss" scoped>
.spotify-player {
  &__message {
    position: absolute;
    right: 10px;
    top: -10px;
    box-shadow: 0 0 10px rgba(black, .1);
  }
}

.pulse-button {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 30px;
  height: 30px;
  text-transform: uppercase;
  text-align: center;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  // color: white;
  font-weight: bold;
  font-size: .5rem;
  letter-spacing: 1px;
  border-radius: 50%;
  padding-top: 2px;
  background: white;
  box-shadow: 0 0 0 0 rgba(black, .5);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% {
   transition: transform(scale(.9));
  }
  70% {
   transition: transform(scale(1));
    box-shadow: 0 0 0 50px rgba(black, 0);
  }
    100% {
   transition: transform(scale(.9));
    box-shadow: 0 0 0 0 rgba(black, 0);
  }
}
</style>
