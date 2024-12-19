<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="press-carousel py-24"
  >
    <swiper
      ref="swiperInstance"
      :key="blok._uid + isMobile"
      :slides-per-view="'auto'"
      :space-between="18"
      :threshold="20"
      :centered-slides="!isMobile ? true : false"
      :loop="!isMobile ? true : false"
      :observer="true"
      :observe-parents="true"
      @swiper="onSwiper"
      @resize="OnResize"
      :breakpoints="{
        '768': {
          spaceBetween: 30,
          slidesPerView: 'auto'
        }
      }"
    >
      <swiper-slide v-for="item in blok.press_carousel_items" :key="item._uuid">
        <div class="relative mx-auto press-carousel__item">
          <div
            class="relative"
          >
            <div class="absolute z-[-1] top-0 left-0 w-full h-full">
              <lazyload-img
                v-if="isImage(item.bg_media.filename)"
                :widths="[1024, 980, 641, 640]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="item.bg_media.filename"
                :src="item.bg_media.filename"
                :alt="item.bg_media.alt ? item.bg_media.alt : item.heading"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :absolute="true"
              />
              <figure 
                v-else-if="isVideo(item.bg_media.filename)" 
                class="ratio-container ratio-container__video block max-w-full relative"
              >
                <play-pause-video 
                  :preload="'metadata'"
                  :muted="true"
                  :playsinline="true"            
                  :loop="true"
                  :autoplay="true"
                  :isSwiper="true"
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.bg_media.filename">
                </play-pause-video>
              </figure>
            </div>
            <div class="press-carousel__item-content flex items-center justify-center text-center text-white">
              <div class="px-5 py-24 md:py-28">
                <p 
                  v-if="item.slug" 
                  class="mb-7 mb-10 uppercase text-xs leading-loose tracking-[2px] futura-std-medium"
                >
                  {{ item.slug }}
                </p>
                <h2 
                  v-if="item.heading" 
                  class="heading-l saol-display-light-italic mb-7 mb-10 md:whitespace-pre-line leading-none"
                >
                  {{ item.heading }}
                </h2>
                <p
                  v-if="item.author_name"
                  class="uppercase text-xs leading-loose tracking-[2px] futura-std-medium"
                >
                  {{ item.author_name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
const { isImage, isVideo } = useUtils();
const swiperr = ref('')
const isMobile = ref(false);

const { blok } = defineProps({
  blok: Object,
});

onMounted(() => {
  console.log(blok);
});

const onSwiper = (swiper) => {
  swiperr.value = swiper;
  if(window.innerWidth < 768) {
    isMobile.value = true;
  }
};

const OnResize = (swiper) => {
  if(window.innerWidth < 768) {
    isMobile.value = true;
  }
};

</script>

<style lang="scss">
  .press-carousel {
    .swiper-slide {
      width: 83%;

      @screen md {
        width: 71.81%;
      }
    }
  }
</style>
