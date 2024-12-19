<template>
  <div
    class="
      py-2
      text-center
      futura-std-medium
      font
      !font-normal
      lg:!font-medium
      text-[0.625rem]
      tracking-[1px]
      leading-[2]
    "
    v-html="richText( 
      currency == 'CA' ? bar?.story?.content?.announcement_message : bar?.story?.content?.announcement_message_us
    )"
  >
  </div>
</template>


<script setup>
const { currency } = useCurrency()
const route = useRoute();
const { richText } = useUtils();
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories/global-elements/header", {
  version: version,
});
const bar = reactive({ story: data.story });
</script>