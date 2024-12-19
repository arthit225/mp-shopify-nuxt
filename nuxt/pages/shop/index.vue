<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
    <LayoutTheMeta :story="story" />
    <!-- <product-choose-currency-modal
      v-if="!currency"
      :show-modal="!currency"
    /> -->
  </div>
</template>

<script setup>
  const { windowState } = useUtils()
  const { currency } = useCurrency();
  const stories = ref(null);
  const storyblokApi = useStoryblokApi();
  const route = useRoute();
  const version = route.query._storyblok || route.isDev ? "draft" : "published";

  const story = await useStoryblok('shop', {
    version: version,
    resolve_relations: 'dose-item.dose_article',
  });
  const component = resolveComponent(story.value.content.component)

</script>