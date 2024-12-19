<template>
  <section
    v-if="blok"
    class="three-asset-hero py-[4.5rem] lg-down:py-[2.5rem]"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <swiper
      ref="swiperInstance"
      :modules="modules"
      :slides-per-view="'auto'"
      :space-between="30"
      :watch-slides-progress="true"
      :threshold="20"
      :pagination="{
        clickable: true
      }"
    >
      <swiper-slide
        v-for="item in blok.three_asset_hero_items"
        :key="item._uuid"
      >
        <div
          :data-reverse="item.reverse_order"
          class="relative flex md:items-center md-down:flex-col mx-auto three-asset-hero__item px-8 md-down:px-2.5"
          :class="(
            item.reverse_order ? 'flex-row': 'flex-row-reverse'
          )"
        >
          <div class="three-asset-hero__left-part relative md:w-1/2 grid">
            <div class="three-asset-hero__first-asset">
              <lazyload-img
                v-if="isImage(item.asset1.filename)"
                :widths="[700, 600, 700, 640]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="item.asset1.filename"
                :src="item.asset1.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :aspectRatio="0.8"
              />
              <figure
                v-else-if="isVideo(item.asset1.filename) && Swiper"
                class="ratio-container ratio-container__video block max-w-full"
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
                  <source :src="item.asset1.filename">
                </play-pause-video>
              </figure>
            </div>

            <div class="three-asset-hero__second-asset">
              <lazyload-img
                v-if="isImage(item.asset2.filename)"
                :widths="[300, 250, 200]"
                :breakpoints="[1024, 641, 640]"
                :key="item.asset2.filename"
                :src="item.asset2.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :aspectRatio="0.8"
              />
              <figure
                v-else-if="isVideo(item.asset2.filename) && Swiper"
                class="ratio-container ratio-container__video block max-w-full"
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
                  <source :src="item.asset2.filename">
                </play-pause-video>
              </figure>
            </div>

            <div class="three-asset-hero__third-asset">
              <lazyload-img
                v-if="isImage(item.asset3.filename)"
                :widths="[300, 250, 200]"
                :breakpoints="[1024, 641, 640]"
                :key="item.asset3.filename"
                :src="item.asset3.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :aspectRatio="0.8"
              />
              <figure
                v-else-if="isVideo(item.asset3.filename) && Swiper"
                class="ratio-container ratio-container__video block max-w-full"
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
                  <source :src="item.asset3.filename">
                </play-pause-video>
              </figure>
            </div>
          </div>

          <div class="three-asset-hero__right-part futura-std-regular md:w-1/2 px-[18px] md:py-4 md:pl-8 md:pr-16">
            <div
              v-if="item.slug"
              class="uppercase text-xs leading-loose tracking-[2px] mb-1 md:mb-2 futura-std-medium md-down:-mt-[5vh]"
            >
              {{ item.slug }}
            </div>
            <h2
              v-if="item.title"
              class="
                three-asset-hero__item__title
                whitespace-pre-line
                heading-m
                mb-1.5
                md:mb-2.5
              "
            >
              {{ item.title }}
            </h2>

            <p
              v-if="item.description"
              class="text-medium leading-[1.375rem] md:leading-[1.688rem] max-w-xl"
            >
              {{ item.description }}
            </p>

            <div
              v-if="item.links && item.links.length > 0"
              class="flex mt-4 flex-wrap gap-3 items-center"
            >
              <div
                v-for="link in item.links"
                :key="link._uuid"
              >
                <nuxt-link
                  v-if="link.link"
                  :to="link.link.url ? link.link.url : '/'"
                  class="button--primary inline-flex justify-center min-w-[163px] items-center"
                >
                  {{ link.link_text }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, A11y } from 'swiper';
import "swiper/css";
import "swiper/css/pagination";

const { isImage, isVideo } = useUtils();

const { blok } = defineProps({ blok: Object });

onMounted(() => {
  console.log("blokky", blok);
});

const modules = [Navigation, Pagination, A11y];
</script>

<style lang="scss">
  .three-asset-hero {
    .ratio-container {
      &__video {
        aspect-ratio: 0.8;
        padding-top: 125%;
      }
    }

    &__left-part {
      grid-template-columns: repeat(24,1fr);
      grid-template-rows: repeat(24,1fr);
      height: 100%;
    }
    &__first-asset {
       grid-column: 1/19;
       grid-row: 2/21;
    }
    &__second-asset {
      grid-column: 20/25;
      grid-row: 9/14;
      @screen md-down {
        grid-row: 7/12;
      }
    }
    &__third-asset {
      grid-column: 15/24;
      grid-row: 15/24;
      position: relative;
      z-index: -1;
    }
    .swiper {
      .swiper-pagination {
        position: unset;
        @screen md-down {
          text-align: left;
          margin-left: toRem(-4);
          padding: 0.5rem toRem(20) 0 toRem(20);
        }
        .swiper-pagination-bullet-active {
          background: black;
        }
      }
    }
  }
</style>