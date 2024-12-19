<template>
  <div>
    <Title>{{ title || titleDefault }}</Title>
    <Meta name="og:title" :content="ogTitle || ogTitleDefault" />
    <Meta name="description" :content="description || descriptionDefault" />
    <Meta name="og:description" :content="ogDescription || ogDescriptionDefault" />
    <Meta name="og:image" :content="ogImage || ogImageDefault" />
    <Meta name="twitter:image" :content="twitterImage || twitterImageDefault" />
    <Meta name="twitter:title" :content="twitterTitle || twitterTitleDefault" />
    <Meta name="twitter:description" :content="twitterDescription || twitterDescriptionDefault" />
    <Meta name="google-site-verification" content="_thihcInDlHk4NEi3-viinvQBwDNd9vresIXEnOxgVQ" />
  </div>
</template>
<script setup>
const {story} = defineProps({
  story: {
    type: [Object],
  }
})
const defaultSEOData = inject("defaultSEOData");
const title = computed(()=>{
  return (((story || {}).content || {}).seo || {}).title
})

const ogTitle = computed(()=>{
  return (((story || {}).content || {}).seo || {}).og_title
    ? (((story || {}).content || {}).seo || {}).og_title
    : (((story || {}).content || {}).seo || {}).title
})
const description = computed(()=>{
  return (((story || {}).content || {}).seo || {}).description
})
const ogDescription = computed(()=>{
  return (((story || {}).content || {}).seo || {}).og_description
    ? (((story || {}).content || {}).seo || {}).og_description
    : (((story || {}).content || {}).seo || {}).description
})
const ogImage = computed(()=>{
  return (((story || {}).content || {}).seo || {}).og_image
})
const twitterImage = computed(()=>{
  return (((story || {}).content || {}).seo || {}).twitter_image
})
const twitterTitle = computed(()=>{
  return (((story || {}).content || {}).seo || {}).twitter_title
    ? (((story || {}).content || {}).seo || {}).twitter_title
    : (((story || {}).content || {}).seo || {}).title
})
const twitterDescription = computed(()=>{
  return (((story || {}).content || {}).seo || {}).twitter_description
    ? (((story || {}).content || {}).seo || {}).twitter_description
    : (((story || {}).content || {}).seo || {}).description
})

const titleDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).title
})
const ogTitleDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).og_title
    ? ((defaultSEOData || {}).seo || {}).og_title
    : ((defaultSEOData || {}).seo || {}).title
})
const descriptionDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).description
})
const ogDescriptionDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).og_description
    ? ((defaultSEOData || {}).seo || {}).og_description
    : ((defaultSEOData || {}).seo || {}).description
})
const ogImageDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).og_image
})
const twitterImageDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).twitter_image
})
const twitterTitleDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).twitter_title
    ? ((defaultSEOData || {}).seo || {}).twitter_title
    : ((defaultSEOData || {}).seo || {}).title
})
const twitterDescriptionDefault = computed(()=>{
  return ((defaultSEOData || {}).seo || {}).twitter_description
    ? ((defaultSEOData || {}).seo || {}).twitter_description
    : ((defaultSEOData || {}).seo || {}).description
})
onMounted(() => {
  console.log('story')
  console.log(story)
});
</script>