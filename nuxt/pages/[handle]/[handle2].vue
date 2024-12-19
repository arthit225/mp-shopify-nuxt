<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
    <LayoutTheMeta :story="story" />
  </div>
</template>

<script setup>
const route = useRoute()
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const params = route.params.handle
console.log('route.params', route.params)
const story = await useStoryblok(params+'/'+route.params.handle2, {
  version: version,
  resolve_relations: 'main-page-content.side_nav',
});

const component = resolveComponent(story.value.content.component)
</script>