<template>
  <div
    :key="blok._uid"
    class="
      dose-text-item
      w-full
      flex-1
      min-h-full
      flex
      justify-center
      flex-col
      mx-auto
    "
    :style="{
      paddingLeft:blok.padding_left + 'px'
    }
    "
    :class="{
      'largeHeading':blok.large_heading,
    }"
  >
    <div
      v-if="blok.slug"
      class="
        whitespace-pre-line
        text-xs
        leading-[1.375rem]
        md:leading-6
        mb-8
        uppercase
      "
    >
      <p>
        {{ blok.slug }}
      </p>
    </div>
    <div
      v-if="blok.title"
    >
      <h2
        class="
          dose-text-title
          saol-display-light leading-1.3
          mb-6
        "
      >
        {{ blok.title }}
      </h2>
    </div>
    <div
      v-if="blok.Description"
      class="
        dose-text-desc
        text-lg
        leading-[27px]
        font-light
        futura-std-normal font-normal
      "
      :style="{
        marginLeft:blok.large_heading?'80px':'0'
      }"
      v-html="richText(blok.Description )"
    />
    <div
      v-if="blok.links"
      class="flex mt-8 gap-8 mb-14"
    >
      <nuxt-link
        v-for="link in blok.links"
        :key="link._uid"
        :to="linkTo(link)"
        :target="link.link.url ?'_blank': '_self'"
        class="
          text-xs
          leading-[1.375rem]
          md:leading-[1.688rem]
          uppercase
          underline
        "
      >
        {{ link.text }}
      </nuxt-link>
    </div>
  </div>
</template>
<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
function linkTo(link) {
  let to = link.link.url ? link.link.url :(link.link.cached_url ? '/'+link.link.cached_url : '/') + (link.link.anchor ? '#' + link.link.anchor : '')
  return link.is_shop_button ? to + '?shop=true'  : to
}
</script>
<style scoped lang="scss">
.dose-text-item {
  max-width: 1144px;
}
.dose-text-title {
  font-size: toRem(27);
  padding: 0 1rem;
  max-width: toRem(768);
  margin-left: auto !important;
  margin-right: auto !important;
}
</style>