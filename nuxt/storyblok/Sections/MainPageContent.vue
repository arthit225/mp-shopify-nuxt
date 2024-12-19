<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      side-nav-section
      md:flex
      justify-between
      px-4
      md:pl-[70px]
      md:pr-[55px]
      md:mt-[85px]
      max-w-[1366px]
      mx-auto
      "
  >
    <div class="flex left-side-nav md:sticky top-[100px] self-start mb-8">
      <div v-if="blok.side_nav.content">
        <div
          v-for="nav_item in blok.side_nav.content.items"
          :key="nav_item.id"
          :style="{
            marginTop: nav_item.margin_top ? nav_item.margin_top + 'px' : 0,
          }"
          class=""
        >
          <nuxt-link
            :to="
              nav_item.link.url
                ? nav_item.link.url
                : nav_item.link.cached_url
                ? '/' + nav_item.link.cached_url
                : '/'
            " 
            class="text-xs
              leading-loose
              tracking-[2px]
              mb-6
              futura-std-medium
              relative
            "
          >
            {{ nav_item.text }}
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="right-body flex flex-col items-end flex-1">
      <component
         v-for="localBlok in blok.right_body"
        :key="localBlok._uid"
        :is="localBlok.component"
        :blok="localBlok"
      />
    </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
</script>
<style scoped>
.router-link-active:after {
  background: var(--mp-coral);
  bottom: -0.3em;
  content: "";
  display: block;
  height: 0.8em;
  left: -0.3em;
  opacity: .6;
  position: absolute;
  width: calc(100% + 0.6em);
  z-index: -1;
}
</style>
