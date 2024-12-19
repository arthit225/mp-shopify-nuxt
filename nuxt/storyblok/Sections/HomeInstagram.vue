<template>
  <section class="home-instagram py-10">
    <header class="px-8 md-down:px-5 pb-9">

      <h2 class="
          futura-std-medium
          tracking-[2px]
          leading-none
          heading-xs
        ">
        <a href="https://instagram.com" class="block uppercase">
          @majestyspleasure
        </a>
      </h2>

    </header>
    <swiper
      ref="swiperInstance"
      slides-per-view="auto"
      :space-between="25"
      class="relative h-[336px] overflow-hidden"
      :threshold="20"
      @swiper="onSwiper"
      @slideChange="slideChange">
      <swiper-slide
        v-for="image in instagramData"
        :key="image.id"
        class="!w-auto !h-full">
        <nuxt-link
          v-if="image.permalink"
          :to="image.permalink"
          target="_blank"
          rel="noreferrer"
          class="block w-auto h-full">
          <lazyload-img
            v-if="image.media_type === 'IMAGE' ||
          image.media_type === 'CAROUSEL_ALBUM'" :src="image.media_url" :alt="image.caption"          
            :key="image.id"
            className="w-auto h-full"
            imgClasses="w-auto h-full"
          />
          <figure v-else class="
              block w-auto h-full">
            <play-pause-video
              :preload="'metadata'"
              :muted="true"
              :playsinline="true"
              :loop="true"
              :autoplay="true"
              :isSwiper="true"
              :classes="'w-auto h-full'">
              <source :src="image.media_url">
            </play-pause-video>
          </figure>
        </nuxt-link>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import axios from "axios";
//import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
const config = useRuntimeConfig();
const count = 20;
const accessToken = config.public.instagramAccessToke

const isLoading = ref(true);
const hasError = ref(false);
const instagramData = ref([]);

async function fetchInstaData(url) {
  const response = await axios.get(url);
  if (response.hasOwnProperty("error")) {
    isLoading.value = false;
    hasError.value = true;
  } else {
    console.log('response', response)
    instagramData.value = response.data.data;
    isLoading.value = false;
  }
}
const mySwiper = ref(null)
const onSwiper = (swiper) => {
  mySwiper.value = swiper;
}
const slideChange = () => {  
  mySwiper.value.update()
}
onMounted(async () => {
  const url = `https://graph.instagram.com/me/media?fields=media_count,media_type,permalink,media_url,caption&limit=${count}&access_token=${accessToken}`;
  await fetchInstaData(url);
});

</script>

<style lang="scss" scoped>
.home-instagram {
  // background-color: var(--mp-off-white);

  .corporate-gifting & {
    padding-top: toRem(100);
    border-top: 1px solid black;
  }
}
</style>
