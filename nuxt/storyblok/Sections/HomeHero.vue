<template>
  <section
    v-if="blok"
    class="
      home-hero
      pt-[4.5rem]
      lg-down:pb-[2.5rem]
      lg-down:pt-0
    "
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    :class="[blok.add_margin_bottom ? 'mb-0 lg:mb-12' : '' ]"
  >
    <swiper
      ref="swiperInstance"
      :autoplay="{
        delay: blok.autoplay ? blok.time_between_change * 1000 : 100000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :threshold="10"
      :watch-slides-progress="true"
      :auto-height="true"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide
        v-for="item in blok.home_hero_items"
        :key="item._uuid"
      >
        <div
          class="
            relative
            flex
            lg:items-center
            lg-down:flex-col
            mx-auto
            home-hero__item
            px-8
            lg-down:px-2.5
            mb-8 lg:mb-0 
          "
          :class="[
            item.reverse_order ? 'lg:flex-row-reverse' : ''
          ]"
        >
          <div
            class="home-hero__left-part relative lg:w-1/2"
            :class="[item.asset2.filename || item.asset3.filename ? 'grid' : 'solo']"
          >
            <div
              class="
                home-hero__first-asset
                relative
              "
              :class="[!item.hide_mp_logo || item.asset2.filename || item.asset3.filename ? 'pr-10 pb-10 lg-down:pr-5 lg-down:pb-14' : '']"
            >
              <lazyload-img
                v-if="isImage(item.asset1.filename)"
                :widths="[700, 600, 700, 640]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="item.asset1.filename"
                :src="item.asset1.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="w-full object-cover blur-up js-figure"
                :aspectRatio="0.8"
                :absolute="true"
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
                  :isSwiper="false"
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.asset1.filename" />
                </play-pause-video>
              </figure>
              <figure
                v-if="!item.hide_mp_logo"
                class="absolute bottom-0 left-0 w-full z-[2]"
              >
                <IconsLogoMark />
              </figure>
            </div>

            <div class="home-hero__second-asset">
              <lazyload-img
                v-if="isImage(item.asset2.filename)"
                :widths="[300, 250, 200]"
                :breakpoints="[1024, 641, 640]"
                :key="item.asset2.filename"
                :src="item.asset2.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover blur-up js-figure"
                :aspectRatio="0.8"
                :absolute="true"
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
                  :isSwiper="false"
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.asset2.filename" />
                </play-pause-video>
              </figure>
            </div>

            <div class="home-hero__third-asset">
              <lazyload-img
                v-if="isImage(item.asset3.filename)"
                :widths="[300, 250, 200]"
                :breakpoints="[1024, 641, 640]"
                :key="item.asset3.filename"
                :src="item.asset3.filename"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover blur-up js-figure"
                :aspectRatio="0.8"
                :absolute="true"
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
                  :isSwiper="false"
                  :classes="'w-full h-full object-cover block absolute top-0 left-0'"
                >
                  <source :src="item.asset3.filename" />
                </play-pause-video>
              </figure>
            </div>
          </div>

          <div class="
              home-hero__right-part
              futura-std-regular
              lg:w-1/2
              px-2.5
              lg:py-4 lg:pr-8 lg:pl-16
            ">
            <h2
              v-if="item.title"
              class="
                home-hero__item__title
                saol-display-light
                whitespace-pre-line
                heading-xl
                mb-1.5
                lg:mb-2.5
                mt-4
                lg:mt-0
              "
            >
              <i>
                {{ item.title }}
              </i>
            </h2>

            <p
              v-if="item.sub_title"
              class="
                whitespace-pre-line
                text-medium
                leading-[1.375rem]
                lg:leading-[1.688rem]
                max-w-lg 
              "
            >
              {{ item.sub_title }}
            </p>

            <div class="
                flex flex-wrap
                justify-start
                items-center
                -mx-2
                mt-6
                lg-down:mt-2
                
              ">
              <div
                v-for="link in item.links"
                :key="link._uuid"
                class="mx-2"
              >
                <nuxt-link
                  v-if="link.link_text"
                  :data-type="JSON.stringify(link.link.linktype)"
                  :target="link.link.linktype == 'url' ? '_blank' : '_self'"
                  :to="link.link.linktype == 'url' ? link.link.cached_url : (link.link.cached_url ? '/' + link.link.cached_url : '/') + (link.link.anchor ? '#' + link.link.anchor : '')"
                  class="button--primary inline-flex"
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
import { Navigation, Pagination, A11y, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const modules = [Navigation, Pagination, A11y, Autoplay];
const { isImage, isVideo } = useUtils();
const { blok } = defineProps({ blok: Object });
</script>

<style lang="scss" scoped>
.solo {
  // padding-top: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  .home-hero__first-asset {
    position: relative;
    width: 100%;
    padding-top: 100%;
    picture {
      position: absolute !important;
      top: 0;
      height: 100% !important;
       img {
        object-fit: cover;
        width: 100%;
        height: 100%;
       }
    }
  }
}
.home-hero {
  .ratio-container {
    &__video {
      aspect-ratio: 0.8;
      padding-top: 125%;
    }
  }

  &__left-part {
    grid-template-columns: repeat(24, 1fr);
    // height: 100%;
  }

  &__first-asset {
    grid-column: 1/19;
    grid-row: 2/21;


    @screen lg-down {
      grid-column: 1/18;
      grid-row: 6/24;

    }
  }

  &__second-asset {
    grid-column: 19/25;
    grid-row: 5/11;

    @screen lg-down {
      grid-column: 18/25;
      grid-row: 7/14;
    }
  }

  &__third-asset {
    grid-column: 13/22;
    grid-row: 12/21;
    position: relative;
    z-index: 1;

    @screen lg-down {
      grid-column: 15/24;
      grid-row: 15/24;
    }
  }
}
</style>

<style lang="scss">
.home-hero {
  .swiper {
    .swiper-pagination {
      bottom: 0;      
      justify-content: flex-start;      
      display: flex;
      padding-left: 1.5rem;
      @screen lg {
        left: 50%;
        width: 50%;
        padding-left: 4rem;
      }      
      .swiper-pagination-bullet {
        height: toRem(9);
        width: toRem(9);
        margin: 0 toRem(11) 0 0;
      }
      .swiper-pagination-bullet-active {
        background: black;
      }
    }
  }
}
</style>
