<template>
  <figure
    class="
      dose-image-item
      md:h-[664px]
      flex-1
      overflow-hidden
      mx-auto
    "
    :key="blok._uid"
    v-if="blok.component==='dose-image-item'"
  >
    <lazyload-img
      v-if="blok && blok.image"
      :widths="[1900, 1300, 780, 640, 320]"
      :breakpoints="[1900, 1300, 780, 641, 320]"
      :key="blok.image.filename"
      :src="blok.image.filename"
      pictureClasses=""
      imgClasses=""
      :defaultRatio="true"
      :absolute="true"
    />
  </figure>
</template>
<script setup>
const { blok } = defineProps({ blok: Object });
</script>
<style scoped>
.dose-image-item {
  max-width: 1144px;
}
</style>