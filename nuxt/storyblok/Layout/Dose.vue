<template>
  <article v-if="blok" class="dose-post mx-auto py-8">
    <template
      v-for="localBlok in props.blok.body"
    >
      <Teleport
        to="#shopping-products-teleport"
        v-if="route.query.shop && localBlok.component === 'shopify-products'"
        :key="localBlok._uid"
      >
        <component
          :is="localBlok.component"
          :blok="localBlok"
        />
      </Teleport>
      <component
        v-else
        :key="localBlok._uid"
        :is="localBlok.component"
        :blok="localBlok"
      />
    </template>
  </article>
</template>

<script setup>
const { isImage, isVideo } = useUtils();
const route = useRoute()
const props = defineProps({
  blok: {
    type: Object,
    required: true,
  },
});
onMounted(() => {
});
</script>

<style lang="scss" scoped>
  .ratio-container {
    &__video {
      aspect-ratio: 0.8;
      padding-top: 125%;
    }
  }
</style>

<script setup>


</script>
