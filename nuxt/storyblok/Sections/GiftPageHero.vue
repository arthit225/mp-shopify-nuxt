<template>
  <section
    class="gift-hero-wrapper"
    :class="[blok.enable_bottom_margin ? 'hero-enable-bottom-margin' : '']"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    v-if="blok"
  >
    <div 
    class="relative flex h-[500px] justify-center"
    >
      <figure class="absolute left-0 top-0 w-full h-full z-[-1]">
        <lazyload-img
          v-if="isImage(blok.bg_image.filename)"
          :widths="[1400, 1200, 1024, 640]"
          :breakpoints="[1200, 1024, 641, 640]"
          :key="blok.bg_image.filename"
          :src="blok.bg_image.filename"
          :pictureClasses="'w-full h-full block'"
          :imgClasses="'w-full h-full object-cover absolute left-0 top-0'"
          :defaultRatio="true"
        />
        <play-pause-video
          v-else
          :preload="true"
          :muted="true"
          :playsinline="true"
          :loop="true"
          :autoplay="true"
          :class="'w-full h-full object-cover'"
        >
          <source :src="blok.bg_image.filename">
        </play-pause-video>
      </figure>
      <article
        class="hero__caption flex flex-col justify-center items-center text-center"
      >
        <h2
          v-if="blok.title"
          class="home-hero__item__title whitespace-pre-line heading-xl mb-1.5 lg:mb-2.5 max-w-[650px]"
          :class="{
            'text-white': blok.is_white
          }"
        >
          {{ blok.title }}
        </h2>
        <div
          v-if="blok.sub_title"
          class="whitespace-pre-line text-medium leading-[1.375rem] md:leading-[1.688rem] smooth-fonts max-w-[370px] mt-[35px]"
          :class="{
            'text-white': blok.is_white
          }"
        >
          {{ blok.sub_title }}
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>


const { blok } = defineProps({ blok: Object });
const { isImage } = useUtils();
onMounted(() => {
  console.log("blokky", blok);
});

</script>

<style lang="scss" scoped>
.hero-enable-bottom-margin {
  margin-bottom: toRem(60);
  @screen md {
      margin-bottom: toRem(120);
  }
}
</style>

