<template>
  <div
    v-if="blok && blok.right_title"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      main-page-hero
      flex
      justify-start
      lg:items-center
      flex-col
      lg:flex-row
    "
  >
    <figure class="w-full lg:w-2/3 realtive">
      <lazyload-img
      v-if="blok && blok.featured_image"
      :widths="[1900, 1300, 780, 640, 320]"
      :breakpoints="[1900, 1300, 780, 641, 320]"
      :key="blok.featured_image.filename"
      :src="blok.featured_image.filename"
      pictureClasses="flex justify-start"
      imgClasses="w-full block lazyload object-contain"
      :defaultRatio="true"
      :absolute="true"
    />
    </figure>
    <div class="mt-5 ml-6 mr-6 lg:absolute lg:right-[16%] z-[1]">
      <h2
        v-if="blok.heading"
        class="
          home-hero__item__title
          whitespace-pre-line
          heading-xl
          mb-1.5
          lg:mb-2.5
        "
      >
        {{ blok.heading }}
      </h2>
      <p
        v-if="blok.description"
        class="
          whitespace-pre-line
          text-medium
          leading-[1.375rem]
          lg:leading-[1.688rem]
          max-w-[360px]
          ml-0 lg:ml-auto
          mt-2
          pl-0
          lg:pl-20
        "
      >
        {{ blok.description }}
      </p>
    </div>
  </div>
  <div
    v-else-if="blok && !blok.right_title"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      main-page-hero
      flex
      justify-end
      lg:items-center
      flex-col
      lg:flex-row
      min-h-[200px]
    "
  >
    <figure class="w-full lg:w-2/3 realtive">
      <lazyload-img
      v-if="blok && blok.featured_image"
      :widths="[1900, 1300, 780, 640, 320]"
      :breakpoints="[1900, 1300, 780, 641, 320]"
      :key="blok.featured_image.filename"
      :src="blok.featured_image.filename"
      pictureClasses="flex justify-end"
      imgClasses="w-full h-auto block lazyload"
    />
    </figure>
    <div class="mt-5 ml-6 mr-6 lg:absolute lg:left-[11%] z-[1]">
      <h2
        v-if="blok.heading"
        class="
          home-hero__item__title
          whitespace-pre-line
          heading-xl
          mb-1.5
          lg:mb-2.5
        "
      >
        {{ blok.heading }}
      </h2>
      <p
        v-if="blok.description"
        class="
          whitespace-pre-line
          text-medium
          leading-[1.375rem]
          lg:leading-[1.688rem]
          max-w-[260px]
        "
      >
        {{ blok.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
</script>

<style lang="scss" scoped>
.main-page-hero {
  padding-bottom: 4.5rem;
  @screen md {
    padding-top: 4.5rem;
  }
  
}
.ml-auto {
  margin-left: auto;
  margin-top: 16px;
}
</style>
