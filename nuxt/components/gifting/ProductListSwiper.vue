<template>
  <section
    class="gifting-product-list relative"
    v-if="giftingProductList.length > 0"
  >
    <swiper
      ref="swiperInstance"
      :slides-per-view="2.5"
      :space-between="0"
      :threshold="20"
      :watch-slides-progress="true"
      :pagination="pagination ? 
        {
          clickable: true,
        } : false"
      @swiper="onSwiper"
      :breakpoints="{
        768: {
          slidesPerView: slidesPerView
        }
      }"
      class="max-w-[800px] !pb-12"
    >
      <swiper-slide
        v-for="product in giftingProducts_selected" :key="product.handle"
        class="p-8"
      >
        <div
          v-if="giftingProductList.includes(product.id)"
          class="relative mx-auto max-w-[124px]"
        >
            <button
              v-if="showRemoveButton"
              @click="removePackaging(product)"
              class="absolute -top-0 -right-2 z-10 close-button"
            >
              <IconsCloseX />
            </button>
            <lazyload-img
              :key="product.featuredImage.src"
              :src="product.featuredImage.src"
              figureClasses="ratio-container block max-w-[20px] mb-4 md-down:mb-2.5"
              pictureClasses="w-full h-full block"
              imgClasses="block object-cover"
              :absolute="true"
              :forceRatio="{
                force: true,
                aspectRatio: 0.8
              }"
            />
          <h1
            class="
            flex justify-center items-center
            text-center"
          >
            {{ product.title }}
          </h1>
        </div>
      </swiper-slide>
    </swiper>
    <div
      v-if="navigation && (giftingProductList.length > slidesPerView)"
      class="swiper-custom-arrows cursor-pointer absolute top-1/2 w-full flex justify-between"
    >
      <div
        class="swiper-nav-button-prev px-2 z-10"
        @click="swiperr.slidePrev()"
      >
        <span class="left-arrow bg-white"></span>
      </div>
      <div
        class="swiper-nav-button-next px-1 z-10"
        @click="swiperr.slideNext()"
      >
        <span class="right-arrow bg-white"></span>
      </div>
    </div>
  </section>
</template>
<script setup>
import {computed} from "vue"
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation, Pagination, A11y } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
const {giftingProductList} = useGiftCart();
const {getProductInfo} = useProducts();
let swiperr = ref(null);
SwiperCore.use([Pagination])
const onSwiper = (swiper) => {
  swiperr.value = swiper;
};
const giftingProducts_selected = ref([])
async function reload_productList(ProductList) {
  const selected_products = []
  for (const productID of ProductList) {
    selected_products.push(await getProductInfo(productID))
  }
  giftingProducts_selected.value = selected_products
}
onMounted(async () => {
  await reload_productList(giftingProductList.value)
})
watch(giftingProductList, async (newGiftingProductList) => {
  await reload_productList(newGiftingProductList)
})

function removePackaging(product){
  giftingProductList.value = giftingProductList.value.filter(
    (id) => id !== product.id
  );
}

const {
  showRemoveButton
} = defineProps({ 
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  slidesPerView: {
    type: Number,
    default: 3.6
  },
  navigation: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Boolean,
    default: true
  }
});
</script>
<style lang="scss" scoped>
.gifting-product-list {
    margin:auto;
    margin-top: 80px;
    .left-arrow,
    .right-arrow
    {
      display: inline-block;
      width: toRem(34);
      height: toRem(34);
      border: 1px solid #d9d9d9;
      border-radius: 50%;
    }

    .left-arrow:after {
      content: '';
      display: inline-block;
      margin-top: toRem(10);
      margin-left: toRem(5);
      width: toRem(12);
      height: toRem(12);
      border-top: 1px solid #d9d9d9;
      border-right: 1px solid #d9d9d9;
      -moz-transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
      transform: rotate(-135deg);
    }

    .right-arrow:after {
      content: '';
      display: inline-block;
      margin-top: toRem(10);
      margin-right: toRem(5);
      width: toRem(12);
      height: toRem(12);
      border-top:1px solid #d9d9d9;
      border-right: 1px solid #d9d9d9;
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
}
button.close-button {
  @apply w-[34px] h-[34px] p-2 border border-black -translate-y-1/2 translate-x-1/2;
  border-radius: 100%;
}

.gifting-step-4 {
  .swiper {
    padding-bottom: 0 !important;
  }
}
</style>