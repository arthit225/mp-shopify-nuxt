<template>
  <div
    class="dose-image-text-block-section
      mx-auto
      grid
      md:grid-cols-2
      items-start gap-6 gap-y-[50px]
      px-8
      my-[70px]
      md:my-[150px]
    "
    :style="{
      columnGap: blok.column_gap ? blok.column_gap + 'px' : '30px'
    }"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <template
      v-for="item in blok.dose_image_text_items"
    >
      <DoseImageItem
        v-if="item.component==='dose-image-item'"
        :key="item._uid"
        :blok="item"
        class="!mx-0"
      />
      <DoseTextItem
        v-else-if="item.component==='dose-text-item'"
        :key="item._uid"
        :blok="item"
        class="max-w-[440px]"
      />
    </template>
  </div>
</template>
<script setup>
const { blok } = defineProps({ blok: Object });
</script>
<style lang="scss">
.dose-text-desc {
  padding: 0 1rem;
  max-width: toRem(768);
  margin-left: auto !important;
  margin-right: auto !important;
  p {
    margin-bottom: 1rem;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  b {
    font-weight: 500;
  }
  ul, ol {
    padding-left: 1rem;
    li {
      list-style: circle;
      p {
        margin: 0;
        padding: 0;
        line-height: 1;
      }
    }
  }
}
.dose-image-text-block-section {
  max-width: 1144px;
  .dose-text-item {
    @screen md-down {
      padding-left:0 !important
    }
    .dose-text-title {
      @apply text-[32px];
      font-style: italic !important;
      @screen md {
        @apply text-[27px];
        font-style: normal !important;
      }
    }
   &.largeHeading  {
    .dose-text-title {
      @apply text-[36px];
      font-style: normal !important;
      @screen md {
        @apply text-[52px];
      }
    }
   }
   .dose-text-desc {
    
    p {
      margin-bottom: 1em;
    }
   }
  }
  
}

</style>
