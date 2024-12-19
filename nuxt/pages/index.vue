<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
    <LayoutTheMeta v-if="story" :story="story" />
    
  </div>
</template>

<script setup>
const story = await useStoryblok(
  'home', 
  {
    version: 'draft',
    resolve_relations: 'dose-item.dose_article' 
  }
);
const component = resolveComponent(story.value.content.component)
</script>