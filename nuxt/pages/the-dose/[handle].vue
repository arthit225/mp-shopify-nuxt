<template>
  <div>
    <component :is="component" :blok="storyState.story.content" />
    <LayoutTheMeta :story="story" />
  </div>
</template>

<script setup>
const { windowState } = useUtils()
const route = useRoute()
const storyState = reactive({ story: '' })
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('the-dose/' + route.params.handle, {
  version: version,
  resolve_relations: 'dose-item.dose_article',
});
storyState.story = story
const  component = resolveComponent(storyState.story.content.component);
// Jsonld script
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'Dose',
  '@id': windowState.origin + '/' + storyState.story.full_slug,
  name: storyState.story.name,
  url: windowState.origin + '/' + storyState.story.full_slug
}));
</script>