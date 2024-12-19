<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="
			rich-text-section
			lg-down:px-5
			py-12
			md:py-16
			px-4
			text-center
			border-mp-gray-2
			border-b
			lg:py-20
		">
    <div
      v-html="richText(blok.heading)"
      class="
				heading-m
				text-5xl
				tracking-tighter
				saol-display-light
			"
    />
    <div
      v-if="blok.content"
      v-html="richText(blok.content)"
      class="		
				font-light
				futura-std-regular
				max-w-3xl
				mx-auto
			"
    />
    <div
      v-if="blok.links"
      class="flex flex-wrap mt-4 justify-center items-center"
    >
        <div v-for="item in blok.links" :key="item._uuid" class="m-2">
          <nuxt-link
            v-if="item.link"
            :to="item.link.url ? item.link.url :(item.link.cached_url ? '/'+item.link.cached_url : '/') + (item.link.anchor ? '#' + item.link.anchor : '')"
            :target="item.link.url ? '_blank' : '_self'"
            class="button--black uppercase inline-flex justify-center items-center"
          >
            {{ item.text }}
          </nuxt-link>
        </div>
      </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
</script>

<style lang="scss">
.rich-text-section {
  // h1 {
  //   margin-bottom: toRem(10);
  // }
	// h2 {
  //   font-family: 'Saol Display Light' !important;
  // }
  p {

    &:empty {
      display: none;
    }
    margin-bottom: 1rem;
		// &:last-of-type {
		// 	margin-bottom: 0;
		// }
  }
}
</style>
