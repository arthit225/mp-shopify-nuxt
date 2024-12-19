<template>
  <div class="">
    <component :is="component" v-if="story" :blok="story.content" />
    <LayoutTheMeta :story="story" />
  </div>
</template>

<script setup>
  const { windowState } = useUtils()
  const stories = ref(null);
  const storyblokApi = useStoryblokApi();
  const route = useRoute();
  const version = route.query._storyblok || route.isDev ? "draft" : "published";
  const data = await storyblokApi.get("cdn/stories", {
    version: version,
    starts_with: 'the-dose'
  });
  stories.value = data.data.stories;
  console.log('data', data)
  const story = await useStoryblok('the-dose', {
    version: version,
    resolve_relations: 'dose-item.dose_article',
  });
  const component = resolveComponent(story.value.content.component)
  onMounted( async () => {
    console.log("THE DOSE INDEX", stories)
  })

  const items = stories.value.map((story, index) => ({
    '@type': 'Dose',
    position: index + 1,
    dose: {
      '@id': windowState.origin + '/' + story.full_slug,
      name: story.name,
      url: windowState.origin + '/' + story.full_slug
    }
  }))

  // Jsonld script
  useJsonld(() => ({
    '@context': 'https://schema.org',
    '@type': 'DoseList',
    doseListElement: items
  }));
</script>