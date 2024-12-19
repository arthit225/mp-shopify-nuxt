<template>
  <div v-if="type == 'product'">
    <Title>{{ shopifyObject.title }}</Title>
    <Meta name="description" :content="shopifyObject.description" />
    <Meta name="og:title" :content="shopifyObject.og_title
                ? shopifyObject.og_title
                : shopifyObject.title" />
    <Meta name="og:description" :content="shopifyObject.og_description
                ? shopifyObject.og_description
                : shopifyObject.description" />
    <Meta name="og:image" :content="shopifyObject.media.edges[0].node.image.src" />
    <Meta name="twitter:title" :content="shopifyObject.twitter_title
                ? shopifyObject.twitter_title
                : shopifyObject.title" />
    <Meta name="twitter:description" :content="shopifyObject.twitter_description
                ? shopifyObject.twitter_description
                : shopifyObject.description" />
    <Meta name="twitter:image" :content="shopifyObject.media.edges[0].node.image.src" />
  </div>
  
  <!-- In case we want other things to include in collection or product.
  So it is better to keep separate code -->

  <div v-else-if="type == 'collection'">
    <Title>{{ shopifyObject.title }}</Title>
    <Meta name="description" :content="shopifyObject.description" />
    <Meta name="og:title" :content="shopifyObject.og_title
                ? shopifyObject.og_title
                : shopifyObject.title" />
    <Meta name="og:description" :content="shopifyObject.og_description
                ? shopifyObject.og_description
                : shopifyObject.description" />
    <Meta name="og:image" :content="shopifyObject.image.url" />
    <Meta name="twitter:title" :content="shopifyObject.twitter_title
                ? shopifyObject.twitter_title
                : shopifyObject.title" />
    <Meta name="twitter:description" :content="shopifyObject.twitter_description
                ? shopifyObject.twitter_description
                : shopifyObject.description" />
    <Meta name="twitter:image" :content="shopifyObject.image.url" />
  </div>
</template>
<script setup>
const {shopifyObject, type} = defineProps({
  shopifyObject: {
    type: [Object],
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

onMounted(() => {
  console.log(shopifyObject)
  console.log(type)
});
</script>