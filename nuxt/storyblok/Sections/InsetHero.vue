<template>
  <section
    v-if="blok"
    v-editable="blok"
		:data-autoplay="blok.interval * 1000"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="inset-hero py-[4.5rem] lg-down:py-[2.5rem]"
  >
    <swiper
      ref="swiperInstance"
      :modules="modules"
      :slides-per-view="'auto'"
      :space-between="30"
      :auto-height="true"
      :watch-slides-progress="true"
      :threshold="20"
			:autoplay="{
				delay: blok.interval ?  blok.interval * 1000 : 10000,
				pauseOnMouseEnter: true,
				disableOnInteraction: true
			}"
      :pagination="{
        clickable: true
      }"
    >
      <swiper-slide v-for="item in blok.inset_hero_items" :key="item._uuid">
        <div 
          class="relative mx-auto inset-hero__item  md-down:px-0"
          :class="[
            item.component == 'inset_hero_item' ? 'px-[4.5rem] lg-down:px-[2.5rem]' : '']"
        >
          <div class="xl:max-w-[70%]"
            :class="[
              item.component == 'inset_hero_item' ? 'mx-auto md:max-w-[90%]' : 'w-full md:max-w-[80%]']"
          >
            <lazyload-img
              v-if="isImage(item.media_asset.filename)"
              :widths="[1400, 1200, 1024, 640]"
              :breakpoints="[1200, 1024, 641, 640]"
              :key="item.media_asset.filename"
              :src="item.media_asset.filename"
              figureClasses="ratio-container block max-w-full"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :aspectRatio="2.048"
            />
            <figure 
              v-else-if="isVideo(item.media_asset.filename) && Swiper" 
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
                <source :src="item.media_asset.filename">
              </play-pause-video>
            </figure>
          </div>

          <div class="inset-hero__content md-down:px-7 futura-std-regular md-down:text-right md:max-w-[34.75rem] relative z-[1] md:absolute md:top-1/2 md:-translate-y-1/2"
          :class="[
            item.component == 'inset_hero_item' ? 'left-auto md-down:mt-4' : 'md-down:mt-6 md:right-[12%] text-right md:max-w-[767px]']"
          >
            <h2
              v-if="item.title"
              class="
                inset-hero__item__title
                whitespace-pre-line
                heading-xl
              ">
                {{ item.title }}
            </h2>

            <div v-if="item.sub_title" class="whitespace-pre-line">
              {{ item.sub_title }}
            </div>

            <div v-if="item.link_text" class="mt-8">
              <nuxt-link
                :to="item.link.url ? item.link.url : item.link.cached_url ? '/'+item.link.cached_url : '/'"
                class="button--primary inline-flex"
              >
                {{ item.link_text }}
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

import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const { isImage, isVideo } = useUtils();

const { blok } = defineProps({ blok: Object });

onMounted(() => {
  console.log("blokky", blok);
});

const modules = [Navigation, Pagination, A11y, Autoplay];
</script>

<style lang="scss">
  .inset-hero {
    .ratio-container {
      &__video {
        aspect-ratio: 2.048;
        padding-top: 48.83%;
      }
    }
    .swiper {
      .swiper-pagination {
        text-align: left;
        margin-left: toRem(-4);
        bottom: 0;
        padding:0 4.5rem;
        @screen lg-down {
          padding:0 2.5rem;
        }
        @screen md-down {
          text-align: right;
          position: unset;
          margin-left: 0;
          margin-top: 0.5rem;
          padding:0 toRem(24);
        }
        .swiper-pagination-bullet-active {
          background: black;
        }
      }
    }
  }
</style>