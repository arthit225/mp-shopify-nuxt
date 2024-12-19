<template>
  <section class="gifting-step-4 gifting-review-step">
    <div class="border-t">
      <div
        v-if="!isReadyToCheckout"
        class="
          border-r
          px-10
          md:px-20
          pb-10
          justify-center
          items-center
          text-center
        "
      >
        <h1
          class="
            text-center
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
          "
        >
          Review Your Custom Gift
        </h1>
        <section class="flex justify-center">
          <ClientOnly>
            <div
              v-for="product in giftingPackingList"
              :key="product.id"
              class=""
            >
              <div
                v-if="giftingPackaging === product.node.id"
                class="max-w-[260px] mx-auto relative"
              >
                <lazyload-img
                  :widths="[600, 500, 300, 767, 640]"
                  :breakpoints="[1400, 1200, 1024, 641, 640]"
                  :key="product.node.featuredImage.src"
                  :src="product.node.featuredImage.src"
                  figureClasses="block w-full h-auto"
                  imgClasses="left-0 top-0 w-[263px] h-[285px] object-cover"
                  :aspect-ratio="1"
                />
                <h1 class="flex justify-center items-center h-20 text-center">
                  {{ product.node.title }}
                </h1>
              </div>
            </div>
            <div class="">
              <div
                class="
                  mx-10
                  w-[320px]
                  md:w-[425px]
                  windsong-display-italic
                  text-3xl
                  min-h-[217px]
                  bg-black
                  text-white
                  p-2
                  border-black border
                  gift-message-leading
                  flex
                  justify-center
                  items-center
                  text-center
                "
              >
                {{ giftingMessage }}
              </div>
              <div class="bg-black white-logo mx-10">
                <span
                  class="
                    inline-block                    
                    w-[320px]
                    md:w-[425px]
                    h-[1.875rem]
                    lg:w-[7rem] lg:h-[2.125rem]
                    bg-black
                    mb-7
                  "
                >
                  <IconsLogoWritten />
                </span>
              </div>
            </div>
          </ClientOnly>
        </section>
        <GiftingProductListSwiper
          :showRemoveButton="false"
          :slidesPerView="4"
          :navigation="true"
          :pagination="false"
        />
        <GiftingPrice />
        <ClientOnly>
          <div class="flex justify-center items-center flex-1 px-4">
            <button
              v-if="!giftingPackaging"
              class="button--black"
              @click="backToStep1"
            >
              BACK TO STEP 1
            </button>
            <button
              v-else-if="!giftingProductList || !giftingProductList.length"
              class="button--black"
              @click="backToStep2"
            >
              BACK TO STEP 2
            </button>
            <button
              v-else-if="!giftingMessage"
              class="button--black"
              @click="backToStep3"
            >
              BACK TO STEP 3
            </button>
            <button
              v-else
              @click="showModal = true"
              class="button--black"
            >
              Add To Cart
            </button>
          </div>
          <button
            class="uppercase underline mt-4 text-xs font-medium"
            @click="editGift"
          >
            Edit your gift
          </button>
        </ClientOnly>
      </div>
      <div
        v-else
        class="ready-to-checkout"
      >
        <h1
          class="
            text-center
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
          "
        >
          Your gift(s) is ready to checkout
        </h1>
      </div>
    </div>

    <GiftingReviewModal
      @close-modal="showModal = false"
      @ready-to-checkout="readyToCheckout"
      :show-modal="showModal"
    />
  </section>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
const { money } = useUtils();
const emit = defineEmits(["update-step"]);
const { isReadyToCheckout, giftingMessage, giftingPackingList, giftingPackaging, giftingProductList } = useGiftCart();
const showModal = ref(false);
function editGift() {
  emit("update-step", 1);
}

onUpdated(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if(urlParams.get('step') === '4' &&!giftingPackaging.value && !giftingMessage.value && !isReadyToCheckout)
    emit("update-step", 1);
});

function readyToCheckout() {
  showModal.value = false
  isReadyToCheckout.value = true
}
function backToStep2() {
  emit("update-step", 2);
}
function backToStep1() {
  emit("update-step", 1)
}
function backToStep3() {
  emit("update-step", 3)
}
</script>
<style lang="scss">
.gifting-review-step {
  margin: auto;

  .gift-message-leading {
    text-align: center;
  }
}
</style>