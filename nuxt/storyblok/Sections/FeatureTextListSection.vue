<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="feature-text-list-section lg-down:px-5 py-12 md:py-16 lg:py-20 text-center border-mp-gray border-b"
  >
    <h2
      v-html="richText(blok.heading)"
      class="heading-m text-5xl tracking-tighter"
    />
    <div class="lg:flex justify-center items-center my-8 max-w-8xl mx-auto">
      <div
        v-for="(feature, index) in blok.features"
        :key="feature.text"
        class="
					px-6
					md:px-8
					flex-1
					mx-auto
					py-8
					border-mp-gray
					whitespace-pre-line
					font-medium
				"
        :class="index ? 'lg-down:border-t lg:border-l' : ''"
      >
        {{  feature.text }}
      </div>
    </div>
    <div
      v-html="richText(blok.bottom_text)"
      class="mt-4 font-light futura-std-medium max-w-6xl mx-auto"
    />
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
</script>

<style lang="scss">
.feature-text-list-section {
  h1 {
    margin-bottom: toRem(10);
  }
  p {
    &:empty {
      padding-bottom: 1em;
    }
  }
  h2 {
    font-family: 'Saol Display Light' !important;
  }
  i {
    font-family: 'Saol Display LightItalic';
    font-weight: 300;
    font-style: italic;
    letter-spacing: -0.03em;
  }
}
</style>
