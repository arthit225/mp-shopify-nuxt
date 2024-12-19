<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="four-up futura-std-medium pt-[6.25rem] pb-[4.5rem] lg-down:pb-[2.5rem] tracking-[2px] md-down:pt-16"
  >
    <header
      v-if="blok.title || blok.see_all_link.url"
      class="
        flex
        gap-4
        px-4
        md:px-8
        leading-[1.5rem]
        tracking-[2px]
        mb-7
      "
    >
      <h2 class="futura-std-medium heading-xs uppercase">
        {{ blok.title }}
      </h2>
      <div v-if="blok.see_all_link" class="flex-1 text-right text-extra-small">
        <nuxt-link
          :to="blok.see_all_link.url ? blok.see_all_link.url : blok.see_all_link.cached_url ? '/'+blok.see_all_link.cached_url : '/'"
          class="underline"
        >
          {{ blok.see_all_link_text }}
        </nuxt-link>
      </div>
    </header>

    <swiper
      ref="swiperInstance"
      :slides-per-view="1.5"
      :space-between="25"
      :grab-cursor="true"
      :threshold="20"
      :watch-slides-progress="true"
      :breakpoints="{
        '768': {
          slidesPerView: 2.5,
          spaceBetween: 20
        },
        '1024': {
          slidesPerView: 3.5,
        },
        '1280': {
          slidesPerView: 4,
        },
      }"
    >
      <swiper-slide v-for="item in blok.four_up_items" :key="item._uuid">
        <div v-if="item.component == 'dose-item'" class="relative mx-auto four-up__item">
          <DoseCard
            :blok="item.dose_article"
          />
        </div>
        <div v-if="item.component == 'four-up-item'" class="relative mx-auto four-up__item">
          <nuxt-link 
            :to="
                item.link.linktype === 'story'
                ? 
                '/' + item.link.cached_url 
                : item.link.cached_url
              "
            class="block"
          >
            <lazyload-img
              v-if="isImage(item.media_asset.filename)"
              :widths="[400, 350, 300, 500]"
              :breakpoints="[1200, 1024, 641, 640]"
              :key="item.media_asset.filename"
              :src="item.media_asset.filename"
              figureClasses="ratio-container block max-w-full mb-4 md-down:mb-2.5"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :absolute="true"
              :forceRatio="{
                force: true,
                aspectRatio: 0.8
              }"
            />
            <figure
              v-else-if="isVideo(item.media_asset.filename) && Swiper"
              class="ratio-container ratio-container__video block max-w-full mb-4 md-down:mb-2.5"
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
                <source :src="item.media_asset.filename" />
              </play-pause-video>
            </figure>
            <p
              class="text-xs mb-3 md-down:mb-1 uppercase mt-5 mid-underline"
              :class="{
                'invisible': !item.category
              }"
            >
              {{item.category ? item.category : 'No Category'}}
            </p>
            <div v-if="item.title" class="md-down:text-sm md-down:leading-[1.25rem] uppercase">
              {{ item.title }}
            </div>
          </nuxt-link>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const { isImage, isVideo } = useUtils();

const { blok } = defineProps({ blok: Object });

onMounted(() => {
  console.log("blokky", blok);
});
</script>

<style lang="scss">
.four-up {
  .ratio-container {
    &__video {
      aspect-ratio: 0.8;
      padding-top: 125%;
    }
  }
  .swiper {
    padding: 0 2rem;
    @screen md-down {
      padding: 0 toRem(20);
    }
    .swiper-slide {
      margin-right: toRem(25);
      width: calc(75% - 25px);
      @screen md {
        margin-right: toRem(20);
        width: calc(40% - 20px);
      }
      @screen lg {
        width: calc(28% - 20px);
      }
      @screen xl {
        width: calc(25% - 20px);
      }
    }
  }
}
</style>