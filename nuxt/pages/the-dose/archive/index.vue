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
  const storyblokApi = useStoryblokApi();
  const stories = ref([]);
  
  const { data } = await storyblokApi.get('cdn/stories/', {
    starts_with: 'the-dose/',
  });
  stories.value = data.stories ;
  </script>