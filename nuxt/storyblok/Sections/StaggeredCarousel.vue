<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :data-disabled-top-margin="blok.disable_top_margin"
    :id="blok._uid"
    class="staggered-carousel"
    :class="(
      blok.disable_top_margin ? '!mt-0':''
    )"
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
        sm:mb-2
      "
    >
      <h2 class="
          futura-std-medium
          heading-xs
      ">
        {{ blok.title }}
      </h2>
      <div
        v-if="blok.see_all_link_text != ''"
        class="
          flex-1
          text-right
          text-extra-small
        "
      >
        <nuxt-link
          :to="blok.see_all_link.url ? '/'+blok.see_all_link.url : '/'"
          class="underline"
        >
          {{ blok.see_all_link_text }}
        </nuxt-link>
      </div>
    </header>

    <swiper
      ref="swiperInstance"
      :slides-per-view="1.3"
      :space-between="50"
      :watch-slides-progress="true"
      :threshold="20"
      :breakpoints="{
        '768': {
          slidesPerView: 2.3,
          spaceBetween: 40,
        },
        '1024': {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        '1280': {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      }"
    >
      <swiper-slide
        v-for="item in blok.carousel_items"
        :key="item._uuid"
      >
        <div class="relative mx-auto staggered-carousel__item">
          <nuxt-link
            v-if="item.cta_link?.cached_url"
            :to="item.cta_link.cached_url ? '/'+item.cta_link.cached_url : '/'"
            class="flex relative flex-col"
          >
            <h3
              v-if="item.title"
              class="
                staggered-carousel__item__title
                whitespace-pre-line
                saol-display-light-italic
                -mb-[0.42em]
                px-3
                md:px-4
                relative
                z-[1]
                text-[6.08vw] leading-none
              "
            >{{ item.title }}</h3>

            <lazyload-img
              v-if="isImage(item.media_asset.filename)"
              :widths="[600, 500, 700, 640]"
              :breakpoints="[1200, 1024, 641, 640]"
              :key="item.media_asset.filename"
              :src="item.media_asset.filename"
              figureClasses="ratio-container block max-w-full"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="0.8"
            />
            <figure
              v-else-if="isVideo(item.media_asset.filename) && Swiper"
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
                <source :src="item.media_asset.filename">
              </play-pause-video>
            </figure>

          </nuxt-link>
          <div
            v-else
            class="flex relative flex-col"
          >
            <h3
              v-if="item.title"
              class="
                staggered-carousel__item__title
                whitespace-pre-line
                saol-display-light-italic
                -mb-[0.42em]
                px-3
                md:px-4
                relative
                z-[1]
                text-[6.08vw] leading-none
              "
            >{{ item.title }}</h3>

            <lazyload-img
              v-if="isImage(item.media_asset.filename)"
              :widths="[600, 500, 700, 640]"
              :breakpoints="[1200, 1024, 641, 640]"
              :key="item.media_asset.filename"
              :src="item.media_asset.filename"
              figureClasses="ratio-container block max-w-full"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="0.8"
            />
            <figure
              v-else-if="isVideo(item.media_asset.filename) && Swiper"
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
                <source :src="item.media_asset.filename">
              </play-pause-video>
            </figure>

          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
//import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const { isImage, isVideo } = useUtils();

const { blok } = defineProps({
  blok: Object,
});

onMounted(() => {
  console.log(blok, 'taigi');
});
</script>

<style lang="scss">
  .staggered-carousel {
    margin-top: toRem(40);
    overflow: hidden;
    
    @screen md {
      margin-top: toRem(150);
    }
    .ratio-container {
      &__video {
        aspect-ratio: 0.8;
        padding-top: 125%;
      }
    }
    &__item {
      &__title {
        font-size: clamp(3.375rem, 6.08vw, 5.188rem);
        position: absolute;
        bottom: calc(100% - 0.42em);
        margin: 0;
      }
    }
    .swiper {
      padding: 0 2rem;
      @screen md-down {
        padding: 0 1rem;
      }

      .swiper-slide {
        height: auto;
        width: calc(66.6666% - 50px);
        margin-right: toRem(50);
        @screen md {
          width: calc(43% - 40px);
          margin-right: toRem(40);
        }
        @screen lg {
          width: calc(33.3333% - 30px);
          margin-right: toRem(30);
        }
        @screen xl {
          width: calc(33.3333% - 50px);
          margin-right: toRem(50);
        }
        &:nth-child(odd) {
          a {
            flex-direction: column-reverse;
          }
          .staggered-carousel__item__title {
            bottom: unset;
            top: calc(100% - 0.42em);
            // margin: 0;
            // margin-top: -0.42em;
            // @screen md-down {
            //   margin-top: -10%;
            // }
          }
        }
        &:first-child {
          .staggered-carousel__item {
            padding-top: toRem(60);
            @screen md-down {
              padding-top: 0;
            }
          }
        }
        &:nth-child(even) {
          .staggered-carousel__item {
            padding-top: toRem(230);
            @screen md-down {
              padding-top: toRem(100);
            }
          }
        }
      }
    }
  }
  .inset-hero + .staggered-carousel {
    margin-top: toRem(40);
  }
</style>
