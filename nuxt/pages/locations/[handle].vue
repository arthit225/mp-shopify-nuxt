<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
    <LayoutTheMeta :story="story" />
  </div>
</template>

<script setup>
const route = useRoute()
const story = await useStoryblok('locations/' + route.params.handle, { version: 'draft' });
const component = resolveComponent(story.value.content.component)
</script>