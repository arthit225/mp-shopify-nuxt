<template>
  <section
    v-if="blok"
    v-editable="blok"
    class="hero-wrapper"
    :class="[
      blok.use_inset_layout ? 'hero-inset-layout-wrapper md:py-[8.25rem] pt-7 pb-20' : '', 
      blok.enable_bottom_margin ? 'hero-enable-bottom-margin' : ''      
    ]"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    :data-image-brightness="(blok.image_brightness / 10)"
    :style="[
      `--filter-brightness : ${(blok.image_brightness / 10)}`
    ]"
  >
    <div
      class="hero relative flex"
      :class="[
        blok.use_inset_layout ? 'hero-inset-layout mx-7 md:mx-16 items-start' : 'px-5 md:px-10 justify-center items-center',
        blok.text_only ? '!min-h-0' : '',
        blok.remove_height ? 'remove-height' : ''
      ]"
    >

      <figure class="absolute left-0 top-0 w-full h-full">

        <!-- Desktop image -->
        <lazyload-img
          v-if="isImage(blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.filename)"
          :widths="[1400, 1200, 1024, 640]"
          :breakpoints="[1200, 1024, 641, 640]"
          :key="blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.filename"
          :src="blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.filename"
          :pictureClasses="[
            blok?.mobile_asset?.filename.length ? 'desktop-asset': '',
            'w-full h-full block'
          ]"
          :imgClasses="'w-full h-full object-cover absolute left-0 top-0'"
          :defaultRatio="true"
        />

        <!-- Mobile image -->
        <lazyload-img
          v-if="blok?.mobile_asset?.filename.length && isImage(blok?.mobile_asset?.filename)"
          :widths="[1400, 1200, 1024, 640]"
          :breakpoints="[1200, 1024, 641, 640]"
          :key="blok?.mobile_asset?.id"
          :src="blok?.mobile_asset?.filename"
          :pictureClasses="'w-full h-full block mobile-asset'"
          :imgClasses="'w-full h-full object-cover absolute left-0 top-0'"
          :defaultRatio="true"
        />

        <!-- Desktop Video -->
        <play-pause-video
          v-if="isVideo(blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.filename) "
          :preload="true"
          :muted="true"
          :playsinline="true"
          :loop="true"
          :is-autoplay="true"
          :controls="true"
          :class="[
            blok?.mobile_asset?.filename.length ? ' desktop-asset' : '',
            'w-full h-full object-cover'
          ]"
        >
          <source :src="blok.Asset.length > 0 ? blok.Asset[0].filename : blok.Asset.filename">
        </play-pause-video>

        <!-- Mobile Video -->
        <play-pause-video
          v-if="blok?.mobile_asset?.filename.length && isVideo(blok?.mobile_asset?.filename)"
          :preload="true"
          :muted="true"
          :playsinline="true"
          :is-plays-in-line="true"
          :loop="true"
          :controls="true"
          :is-autoplay="true"
          :class="'w-full h-full object-cover mobile-asset'"
        >
          <source :src="blok?.mobile_asset?.filename">
        </play-pause-video>

      </figure>

      <article
        v-if="blok.text"
        class="hero__caption flex flex-col justify-center text-mp-cream z-[1]"
        :class="[blok.use_inset_layout ? 'py-12 px-5 md:py-20 md:px-8' : 'py-[2rem] md:py-[7rem] items-center',
          blok.use_max_width ? 'md:max-w-[32.125rem]': '']"
        :style="{
          color: blok.text_color ? blok.text_color.color : '#000000',
        }"
      >
        <h2
          v-if="blok.text"
          v-html="blok.text"
          class="whitespace-pre-line lg:!leading-none"
          :class="[
            blok.use_inset_layout ? 'heading-m leading-none mb-6' : 'c whitespace-pre-line heading-l leading-[1.05] text-center max-w-[66.56rem] mx-auto',
            blok.text_not_italic ? 'saol-display-light' :'saol-display-light-italic'
          ]
          "
        />
        <div
          v-if="blok.small_heading"
          class="futura-std-medium max-w-[428px]"
          :class="[
              blok.use_inset_layout
              ?
              'text-[17px] leading-[1.41] mb-10 md:whitespace-pre-line'
              :
              'mb-5 md:mb-[1.875rem] text-extra-small leading-[2] tracking-[2px]'
              ]
            "
        >
          {{ blok.small_heading }}
        </div>

        <div v-if="blok.link && blok.link_text">
          <nuxt-link
            :to="blok.link.url ? blok.link.url :(blok.link.cached_url ? '/'+blok.link.cached_url : '/') + (blok.link.anchor ? '#' + blok.link.anchor : '')"
            :target="blok.link.url ? '_blank': '_self'"
            class="button--primary-reverse"
            :style="{
              color: blok.text_color ? blok.text_color.color : '#000000',
              borderColor: blok.text_color ? blok.text_color.color : '#000000',
            }"
          >
            {{ blok.link_text }}
          </nuxt-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { isImage, isVideo } = useUtils();

onMounted(() => {
  // console.log('blokky', blok)
});
</script>
<style lang="scss">
.hero {
  img, video {
    filter: brightness(var(--filter-brightness));
  }
}
</style>
<style lang="scss">
.mobile-asset {
  display: block;
  @screen sm {
    display: none;
  }
}
.desktop-asset {
  display: none;
  @screen sm {
    display: block;
  }
}
.hero-inset-layout-wrapper {
  @screen md {
    /*border-top: 1px solid currentColor;*/ /*Don't need border in /corporate-gifting page */
  }
}
.hero {
  min-height: calc(100vw * 1.5);//9:16
  @screen md {
    min-height: calc(56.25vw); //16:9
  }
  
  &.hero-inset-layout {
    min-height: 133.5vw;
    align-items: flex-end;
    @screen md {
      min-height: calc(42.86vw);
    }

  }
}
.hero.remove-height {
  min-height: unset;
  @screen md {
    min-height: unset;
  }
}
.hero-enable-bottom-margin {
  margin-bottom: toRem(60);
  @screen md {
     margin-bottom: toRem(120);
  }
}
</style>
