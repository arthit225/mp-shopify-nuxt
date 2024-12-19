<template>
  <div
    class="
      category-search
      grid md:grid-cols-4 gap-5 gap-y-[140px]
      px-10
      my-16
    "
  >
    <DoseCard
      v-for="story in stories"
      :key="story._uid"
      :blok="story"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const { kebabCase} = useUtils();
const tags = route.params.term.split('&').map(term=>kebabCase(term));
const storyblokApi = useStoryblokApi();
const stories = ref([]);

const { data: tagsData } = await storyblokApi.get('cdn/tags/', {
  starts_with: 'the-dose/'
});
const topics = tagsData.tags
  .filter((t) => tags.includes(kebabCase(t.name)))
  .map((topic) => topic.name)
  .join(',');
  console.log('topics', topics)
const search_tag = topics ? topics : route.params.term;
const { data } = await storyblokApi.get('cdn/stories/', {
  starts_with: 'the-dose/',
  with_tag: search_tag
});
stories.value = data.stories ;
</script>