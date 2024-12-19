<template>
  <div
    v-if="blok"
    v-editable="blok"
    :data-component="blok.component"
    :id="blok._uid"
    class="dose-two-up-item
      flex
      justify-between
      md:items-center
      flex-col-reverse
    "
    :class="{
      'md:flex-row': !blok.reverse,
      'md:flex-row-reverse': blok.reverse
    }"
  >
    <div class="md:w-1/2 z-[1] py-6"
      :class="{
        'pl-[20px]': blok.reverse,
        'pr-[20px]': !blok.reverse
      }"
    >
      <div
        v-if="blok.category"
        class="
          whitespace-pre-line
          text-xs
          leading-[1.375rem]
          md:leading-[1.688rem]
        "
        :class="{
          'md:-ml-[70px]': blok.reverse,
          'md:-mr-[70px] text-right ml-auto': !blok.reverse
        }"
      >
        <p class="big-underline">
          {{ blok.category }}
        </p>
      </div>
      <h2
        v-if="blok.title"
        class="
          heading-m leading-none mb-3
          whitespace-pre-line
        "
        :class="{
          'md:-ml-[70px]': blok.reverse,
          'md:-mr-[70px] text-right': !blok.reverse
        }"
      >
        {{ blok.title }}
      </h2>
      <p
        v-if="blok.description"
        class="
          whitespace-pre-line
          text-medium
          leading-[1.375rem]
          md:leading-[1.688rem]
          max-w-[309px]
        "
        :class="{
          'ml-[10px]': blok.reverse,
          'mr-[10px] ml-auto text-right': !blok.reverse
        }"
      >
        {{ blok.description }}
      </p>
      <div
        class="flex mt-8 -mx-4 mb-14"
        :class="{
          'pl-[10px]': blok.reverse,
          'pr-[10px] flex-row-reverse': !blok.reverse
        }"
      >
        <nuxt-link
          v-for="link in blok.links"
          :key="link._uid"
          :to="link.link.url ? link.link.url :(link.link.cached_url ? '/'+link.link.cached_url : '/') + (link.link.anchor ? '#' + link.link.anchor : '')"
          :target="link.link.url ?'_blank': '_self'"
          class="
            text-xs
            leading-[1.375rem]
            md:leading-[1.688rem]
            uppercase
            underline
            mx-4
          "
        >
          {{ link.text }}
        </nuxt-link>
      </div>
    </div>
    <div class="md:w-1/2"
      :class="{
        'pl-16 md:pr-[35px]': blok.reverse,
        'pr-16 md:pl-[35px]': !blok.reverse
      }"
    >
      <figure
        class="max-w-[525px]"
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
    </div>
  </div>
</template>
<script setup>
const { blok } = defineProps({ blok: Object });
</script>
<style lang="scss">
.dose-two-up-section {
  @screen md {
    margin-top: toRem(72);
    margin-bottom: toRem(72);
    .dose-two-up-item:not(:first-child) {
      margin-top: toRem(-72);
    }
  }
}
</style>