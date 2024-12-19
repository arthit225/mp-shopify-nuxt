<template>
  <section
    v-if="blok && blok.hide != true"
    class="membership-two-up-hero"
    ref="root"  
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <div class="grid lg:grid-cols-2">
      <header
        v-if="blok.mobile_stack_order == true"
        class="flex flex-col-reverse lg:hidden -mb-4 relative z-[1] text-center order-first"
      >
        <h2
          v-if="blok.title"
          class="
            heading-xl
            lg:!text-9xl
            tracking-tighter
            whitespace-pre-line !not-italic !leading-[0.6] lg:!leading-[0.6] 
            mb-3
          "
        >
          {{ blok.title }}
        </h2>      
        <h3
          v-if="blok.sub_title"
          class="
            heading-sm
            mb-4
            !tracking-widest
            font-bold
            uppercase
          "
        >
          {{ blok.sub_title }}
        </h3>
      </header>
      <div
        class="
					two-up-hero__img-wrapper
					w-full
					border-10 border-black
				"
        :class="[blok.media_position == 'right' ? 'lg:order-1' : '', blok.media_position_mobile == 'bottom' ? 'order-1' : '']"
      >
        <swiper
          ref="swiperInstance"
          :modules="modules"
          :slides-per-view="1"
          :space-between="0"
          :threshold="10"
          :watch-slides-progress="true"
          :auto-height="false"
          :autoplay="{
            delay: blok.carousel_interval ? blok.carousel_interval  : 2000 ,
				    disableOnInteraction: true
          }"
          :loop="true"
					class=""
        >
          <swiper-slide
            v-for="(media_asset, index) in blok.media_assets"
            :key="index"
						class=""
          >
            <lazyload-img
              v-if="isImage(media_asset.filename)"
              :widths="[900, 700, 600, 512, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="media_asset.filename"
              :src="media_asset.filename"
              figureClasses="ratio-container block max-w-full"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover w-full h-full"
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
          </swiper-slide>
        </swiper>
      </div>
      <div
        class="
          membership-two-up-hero__content
          text-center
          lg:max-w-[34.25rem]
          mx-auto
          lg:py-4 lg:px-4
        "
      >
        <header class="">

				<figure
					class="
					hero__membership-logo 	hero__membership-logo--black">
					<icons-logo-inline-written/>
				</figure>

          <h2
            v-if="blok.title"
            class="							
              tracking-tighter
              whitespace-pre-line !not-italic !leading-[0.6] lg:!leading-[0.6]
              mb-3
							membership-hero__title
            "
          >
            {{ blok.title }}
          </h2>        
        </header>
        <div
          class="
            heading-m
            leading-[1.375rem]
            lg:leading-[1.688rem]
            tracking-tightest
          "
        >
          <p v-if="blok.description" class="mt-6 mb-12 saol-display-light">
            <i>{{ blok.description }}</i>
          </p>
          <div class="flex flex-wrap -m-2 justify-center items-center"
          :class="[blok.media_position_mobile == 'bottom' ? 'mb-10' : '']"
          >
            <div v-for="item in blok.links" :key="item._uuid" class="m-2">
              <nuxt-link
                v-if="item.button_link"
                :to="item.button_link.url ? item.button_link.url :(item.button_link.cached_url ? '/'+item.button_link.cached_url : '/') + (item.button_link.anchor ? '#' + item.button_link.anchor : '')"
                :target="item.button_link.url ? '_blank' : '_self'"
                class="button--primary uppercase inline-flex justify-center items-center !px-10 !py-4 "
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
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper";
import "swiper/css";
const { blok } = defineProps({ blok: Object });
const { isImage, isVideo } = useUtils();
const root = ref()
const modules = [Autoplay];
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
.membership-two-up-hero {
  background-color: var(--bg-color);
	border-top: solid 1px #ccc;
	border-bottom: solid 1px #ccc;
  .button--primary {
    line-height: 1;
	}
}
.two-up-hero__img-wrapper {
	width: 100vw;
	height: 100vw;
	overflow: hidden;
	@screen lg {
		width: 50vw;
		height: 50vw;
	}
	.swiper {
		width: 100%;
		height: 100%;
		.swiper-slide {
			width: 100%;
			height: 100%;
			img, picture, video {
				width: 100%;
				height: 100%;
			}
			img, video {
				object-fit: cover;
			}
		}
	}

}
.membership-two-up-hero__content {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 3.5rem 1rem;
}
</style>