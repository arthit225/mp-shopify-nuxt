<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="social-section
    flex
    justify-end
    max-w-[1366px]
    mx-auto
    mt-[88px]
    mb-4
    md:mb-[140px]
  "
  >
    <div class="flex flex-col md:inline-block border-black border-t py-5 px-5">
      <p class="text-xs leading-loose tracking-[2px] mb-[36px] futura-std-medium">
        {{ blok.title }}
      </p>
      <div class="flex gap-y-2 sm:flex-row break-all flex-wrap">
        <nuxt-link
          v-for="social_item in blok.social_items"
          :key="social_item._uid"
          :to="social_item.link.url ? social_item.link.url : social_item.link.cached_url ? '/'+ social_item.link.cached_url : '/'"
          class="text-[2rem] saol-display-light leading-none mr-4 fancy-underline
          fancy-underline--has-underline"
        >
          {{ social_item.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });

</script>

