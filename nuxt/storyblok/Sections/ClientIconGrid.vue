<template>
  <section
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    v-if="blok"
    class="client-icon-grid py-20 text-center"
  >
    <header v-if="blok.heading" class="px-8 pb-14 md:pb-20">
      <h2 class="heading-m leading-none mb-3"><i>{{ blok.heading }}</i></h2>
    </header>
    <div 
      v-if="blok.icon_blocks.length > 0"
      class="client-icon-grid__items grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-8 md:max-w-[931px] mx-auto px-8"
    >
      <div
        v-for="item in blok.icon_blocks"
        :key="item._uid"
        class="client-icon-grid__item"
      >
        <nuxt-link
          v-if="item.link.cached_url"
          :to="
              item.link.linktype === 'story'
              ? 
              '/' + item.link.cached_url 
              : item.link.cached_url
            "
          class="block mx-auto"
        >
          <div class="client-icon-grid__svg-wrapper" v-if="item.use_image && item.image?.filename">
            <lazyload-img
              :widths="[200, 200, 200, 200]"
              :breakpoints="[1200, 1024, 768, 640]"
              :key="item.image.filename"
              :width="item.image.width"
              :height="item.image.height"
              :src="item.image.filename"
              :alt="
                item.image.altText ? item.image.altText : ''
              "
              imgClasses="block object-cover lazyload blur-up"
            >
            </lazyload-img>
          </div>
          <div v-else class="client-icon-grid__svg-wrapper" v-html="item.svg"></div>
          <span v-if="item.link_ada_text" class="sr-only">{{ item.link_ada_text }}</span>
        </nuxt-link>
        <div
          v-else
          class="block mx-auto"
        >
          <div class="client-icon-grid__svg-wrapper" v-if="item.use_image && item.image?.filename">
            <lazyload-img
              :widths="[200, 200, 200, 200]"
              :breakpoints="[1200, 1024, 768, 640]"
              :key="item.image.filename"
              :width="item.image.width"
              :height="item.image.height"
              :src="item.image.filename"
              :alt="
                item.image.altText ? item.image.altText : ''
              "
              imgClasses="block mx-auto object-cover lazyload blur-up"
            >
            </lazyload-img>
          </div>
          <div v-else class="client-icon-grid__svg-wrapper" v-html="item.svg"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
</script>

<style lang="scss">
  .client-icon-grid {
    border-top: 1px solid currentColor;
    &__svg-wrapper {
      svg{
        margin: 0 auto;
        max-width: 100%;
        @screen md-down {
          max-width: toRem(100);
        }
      }
    }
  }
</style>