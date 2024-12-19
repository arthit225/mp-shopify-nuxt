<template>
  <div class="dose-card">
    <nuxt-link :to="`/${blok.full_slug}`" class="block" :aria-label="'Permalink to ' + blok.name">
      <lazyload-img
        v-if="blok.content && blok.content.featured_asset && isImage(blok.content.featured_asset.filename)"
        :widths="[400, 350, 300, 500]"
        :breakpoints="[1200, 1024, 641, 640]"
        :key="blok.content.featured_asset.filename"
        :src="blok.content.featured_asset.filename"
        figureClasses="ratio-container block max-w-full mb-4 md-down:mb-2.5"
        pictureClasses="w-full h-full block"
        imgClasses="block object-cover"
        :absolute="true"
        :forceRatio="{
          force: true,
          aspectRatio: 0.8
        }"
      />
      <ul class="tags-row text-xs mb-4 md-down:mb-2 uppercase mt-5 flex -mx-1.5">
        <li
          v-for="tag in blok.tag_list"
          :key="tag"
          class="mx-3"
        >
          <nuxt-link
            class="mid-underline"
            :to="'/the-dose/category/'+tag"
          >
            {{ tag }}
          </nuxt-link>
        </li>
        <li
          v-if="!(blok.tag_list && blok.tag_list.length)"
          class="invisible"
        >
          No Category
        </li>
      </ul>
      <div v-if="blok.name" class="md-down:text-sm md-down:leading-[1.25rem]
      max-h-[40px] md:max-h-[47px] overflow-hidden slug-xs">
        {{ blok.name }}
      </div>
    </nuxt-link>
  </div>
</template>
<script setup>
const { isImage, isVideo } = useUtils();
const { blok } = defineProps({ blok: Object });
</script>