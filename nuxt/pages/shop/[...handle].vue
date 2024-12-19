<template>
  <div>
    <component :is="component" :blok="storyState?.story?.content" />
    <!-- <product-choose-currency-modal
      v-if="!currency"
      :show-modal="!currency"
    /> -->
    <LayoutTheMeta :story="story" />
  </div>
</template>

<script setup>
const { windowState } = useUtils()
const { currency } = useCurrency();
const route = useRoute()
const storyState = reactive({ story: '' })
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = ref(null)
let  component
try {
    story.value = await useStoryblok('shop/' + route.params.handle.join("/"), {
    version: version,
    resolve_relations: 'dose-item.dose_article',
    });
    storyState.story = story.value
    component = resolveComponent(storyState?.story?.content?.component);
} catch(e) {
    
}

</script>

