<template>
  <section
    v-if="blok"
    class="two-up-hero"
    ref="root"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div
      class="
        flex flex-col
        md:flex-row
        items-center
        py-10
        md:py-0 md:px-0
        futura-std-regular
      "
      :class="[blok.margin == true ? 'px-8 py-8 lg:py-24 lg:px-24' : 'px-4']"
    >
      <header
        v-if="blok.mobile_stack_order == true"
        class="flex flex-col-reverse md:hidden -mb-4 relative z-[1] text-center order-first"
      >
        <h2
          v-if="blok.title"
          class="
            saol-display-light
            heading-m
          "
          v-html="blok.title"
        />
        <h3
          v-if="blok.sub_title"
          class="
            text-xs
            leading-loose
            tracking-[2px]
            mb-1
            futura-std-medium
          "
        >
          {{ blok.sub_title }}
        </h3>
      </header>
      <div
        class="two-up-hero__img-wrapper mb-6 md:mb-0 w-full md:w-1/2"
        :class="[blok.media_position == 'right' ? 'md:order-1' : '', blok.media_position_mobile == 'bottom' ? 'order-1' : '']"
      >
        <lazyload-img
          v-if="isImage(blok.media_asset.filename)"
          :widths="[900, 700, 600, 512, 640]"
          :breakpoints="[1400, 1200, 1024, 641, 640]"
          :key="blok.media_asset.filename"
          :src="blok.media_asset.filename"
          figureClasses="ratio-container block max-w-full"
          pictureClasses="w-full h-full block"
          imgClasses="block object-cover w-full"
          :aspectRatio="0.8"
        />

        <figure
          v-else
          class="ratio-container ratio-container__video block max-w-full relative overflow-hidden"
        >
          <play-pause-video
            :preload="true"
            :autoplay="true"
            :muted="true"
            :playsinline="true"
            :loop="true"
            :class="'w-full h-full object-cover absolute top-0 left-0'"
          >
            <source :src="blok.media_asset.filename">
          </play-pause-video>
        </figure>
      </div>
      <div class="
          two-up-hero__content
          text-center
          md:max-w-[34.25rem]
          mx-auto
          md:py-4 md:px-4
          w-full
          md:w-1/2
        ">
        <header
          class="flex-col-reverse"
          :class="[blok.mobile_stack_order == true ? 'hidden md:flex' : 'flex']"
        >
          <h2
            v-if="blok.title"
            class="
              heading-m
              leading-none
              mb-3
            "
            v-html="blok.title"
          />
          <h3
            v-if="blok.sub_title"
            class="
              text-xs
              leading-loose
              tracking-[2px]
              mb-1
              uppercase
            
            "
          >
            {{ blok.sub_title }}
          </h3>
        </header>
        <div class="
            text-medium
            leading-[1.375rem]
            md:leading-[1.688rem]
            
          ">
          <p
            v-if="blok.description"
            v-html="blok.description"
            class="mb-6 whitespace-pre-line"
          />
          <div
            class="flex flex-wrap -m-2 justify-center items-center"
            :class="[blok.media_position_mobile == 'bottom' ? 'mb-10' : '']"
          >
            <div
              v-for="item in blok.links"
              :key="item._uuid"
              class="m-2"
            >
              <nuxt-link
                v-if="item.button_link"
                :to="item.button_link.url != '' ? item.button_link.url :(item.button_link.cached_url ? '/'+item.button_link.cached_url : '/') + (item.button_link.anchor ? '#' + item.button_link.anchor : '')"
                :target="item.button_link.url ? '_blank' : '_self'"
                class="button--primary inline-flex justify-center min-w-[163px] items-center"
              >
                {{ item.button_text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { isImage, isVideo } = useUtils();
const root = ref()

onMounted(() => {
  root.value.style.setProperty('--bg-color', blok.background_color.color);
})
</script>

<style lang="scss" scoped>
:root {
  --bg-color: white;
}
.ratio-container {
  &__video {
    aspect-ratio: 0.8;
    padding-top: 125%;
  }
}
.two-up-hero {
  background-color: var(--bg-color);
  .button--primary {
    line-height: 1;
    /* color: black;
    / border-color: black;*/
    @screen md-down {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      min-width: 8.813rem;
    }
  }
}
</style>