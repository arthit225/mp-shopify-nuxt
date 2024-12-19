<template>
  <section
    v-if="blok"
    class="two-asset-hero py-[4.5rem] lg-down:py-[2.5rem]"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <swiper
      ref="swiperInstance"
      :modules="modules"
      :slides-per-view="'auto'"
      :auto-height="true"
      :space-between="30"
      :watch-slides-progress="true"
      :threshold="20"
      :grab-cursor="true"
      :pagination="{
        clickable: true
      }"
      class="!pb-4"
    >
      <swiper-slide v-for="item in blok.two_asset_hero_items" :key="item._uuid">
        <div class="relative flex md:items-center md-down:flex-col mx-auto two-asset-hero__item px-16 lg-down:px-10 md-down:px-5"
          :class="[item.inverse_content_position ? 'md:flex-row-reverse two-asset-hero__item--inverse' : '']"
        >
          <div class="two-asset-hero__left-part relative md-down:mb-7 md:w-1/2">
            <div class="two-asset-hero__first-asset md:px-[8vw]"
              :class="[item.asset2.filename ? 'pl-[4.375rem]' : '']"
            >
              <lazyload-img
                v-if="isImage(item.asset1.filename)"
                :widths="[700, 600, 700, 640]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="item.asset1.filename"
                :src="item.asset1.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :absolute="true"
              />
              <figure 
                v-else-if="isVideo(item.asset1.filename) && Swiper" 
                class="ratio-container relative ratio-container__video block max-w-full"
              >
                <play-pause-video 
                  :preload="'metadata'"
                  :muted="true"
                  :playsinline="true"            
                  :loop="true"
                  :autoplay="true"
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.asset1.filename">
                </play-pause-video>
              </figure>
            </div>

            <div class="two-asset-hero__second-asset absolute left-0 top-8 md-down:top-5 w-[8.75rem] md:w-[16vw]">
              <lazyload-img
                v-if="isImage(item.asset2.filename)"
                :widths="[300, 250, 200]"
                :breakpoints="[1024, 641, 640]"
                :key="item.asset2.filename"
                :src="item.asset2.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :aspectRatio="1"
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
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.asset2.filename">
                </play-pause-video>
              </figure>
            </div>
          </div>

          <div class="two-asset-hero__right-part futura-std-regular md:w-1/2 md:py-4"
            :class="[item.inverse_content_position ? 'md:px-[4vw]' : '']"  
          >
            <div v-if="item.slug" class="uppercase text-xs leading-loose tracking-[2px] mb-1 md:mb-2 futura-std-medium">
              {{ item.slug }}
            </div>
            <h2
              v-if="item.title"
              class="
                two-asset-hero__item__title
                whitespace-pre-line
                mb-1.5
                md:mb-2.5
                heading-m
              ">
                {{ item.title }}
            </h2>
            
            <p v-if="item.description" class="whitespace-pre-line text-medium leading-[1.375rem] md:leading-[1.688rem] max-w-xl">
              {{ item.description }}
            </p>
            
            <div v-if="item.button_1_text || item.button_2_text" class="mt-6 flex gap-x-[18px] items-center md-down:mb-2">
              <nuxt-link
                v-if="item.button_1_text"
                :to="item.button_1_link.url ? item.button_1_link.url :(item.button_1_link.cached_url ? '/'+item.button_1_link.cached_url : '/') + (item.button_1_link.anchor ? '#' + item.button_1_link.anchor : '')"
                :target="item.button_1_link.url ?'_blank': '_self'"
                class="button--primary inline-flex justify-center min-w-[163px] items-center"
              >
                {{ item.button_1_text }}
              </nuxt-link>
              <nuxt-link
                v-if="item.button_2_text"
                :to="item.button_2_link.url ? item.button_2_link.url : (item.button_2_link.cached_url ? '/'+item.button_2_link.cached_url : '/') + (item.button_2_link.anchor ? '#' + item.button_2_link.anchor : '')"
                :target="item.button_2_link.url ?'_blank': '_self'"
                class="button--primary inline-flex justify-center min-w-[163px] items-center"
              >
                {{ item.button_2_text }}
              </nuxt-link>
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
const modules = [Navigation, Pagination, A11y];
</script>

<style lang="scss">
  .two-asset-hero {

    &__right-part {
      max-width: toRem(500);
    }
    .ratio-container {
      &__video {
        aspect-ratio: 0.8;
        padding-top: 125%;
      }
    }
    &__second-asset {
      .ratio-container {
        &__video {
          aspect-ratio: 1;
          padding-top: 100%;
        }
      }
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
    &__item {
      &--inverse {
        .corporate-gifting & {
          @screen md-down {
            flex-direction: column-reverse;
            .two-asset-hero__left-part {
              // margin-bottom: 0;
            }
            .two-asset-hero__right-part {
              margin-bottom: toRem(40)
            }
          }
        }
      }
    }
  }
</style>