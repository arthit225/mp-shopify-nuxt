<template>
  <section class="gifting-step-3 gifting-message-step">
    <div class="md:flex border-t">
      <div class="border-r px-4 pb-10 w-full md:w-1/2">
        <h1
          class="
            text-center
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
          "
        >
          Write Your Message
        </h1>
        <div class="px-10 text-center max-w-[515px] m-auto">
          <div
            class="
              h-[384px]
              md:h-[600px]
              flex
              items-center
              justify-content
              bg-black
            "
          >
            <textarea
              maxlength="50"
              class="
                windsong-display-italic
                text-5xl
                bg-black
                text-white text-center
                p-2
                border-black border
                w-full
                outline-0
                px-8
                resize-none
              "
              v-model="giftingMessage"
              placeholder="Write message here..."
              name=""
              id=""
              cols="30"
            >
            </textarea>
          </div>
          <div class="bg-black white-logo w-full">
            <span
              class="
                inline-block
                w-[6.125rem]
                h-[1.875rem]
                lg:w-[7rem] lg:h-[2.125rem]
                bg-black
                mb-7
              "
            >
              <IconsLogoWritten />
            </span>
          </div>
          <div
            class="msg-bottom-notice self-start w-full text-left mt-5 text-xl"
          >
            {{ 50 - (giftingMessage ? giftingMessage.length : 0) }} characters left
          </div>
        </div>
      </div>
      <div class="justify-center items-center px-4 w-full md:w-1/2">
        <h1
          class="
            text-center
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
          "
        >
          Your Custom Gift
        </h1>
        <ClientOnly>
          <div
            v-for="product in giftingPackingList"
            :key="product.id"
            class="flex-1 text-center"
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
        </ClientOnly>
        <GiftingProductListSwiper />
        <GiftingPrice />
        <ClientOnly>
          <div class="flex justify-center items-center flex-1 px-4 mb-[70px]">
            <button
              v-if="!giftingPackaging"
              class="button--black"
              @click="backToStep1"
            >
              BACK TO STEP 1
            </button>
            <button
              v-else-if="!giftingProductList.length"
              class="button--black"
              @click="backToStep2"
            >
              BACK TO STEP 2
            </button>
            <button
              v-else
              @click="nextStep"
              class="button--black"
              :disabled="giftingMessage ? false : 'disabled'"
            >
              Continue to Step 4
            </button>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["update-step"]);
const {
  isReadyToCheckout,
  giftingMessage,
  giftingPackingList,
  giftingProductList,
  giftingPackaging,
} = useGiftCart();


function backToStep2() {
  emit("update-step", 2);
}
function backToStep1() {
  emit("update-step", 1)
}
watch(giftingMessage, async(newgiftingMessage) => {
  if (newgiftingMessage) {
    isReadyToCheckout.value = false
  }
})
function nextStep() {
  if (!giftingMessage.value) return;
  emit("update-step", 4);
}
onMounted(() => {
  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + (tx[i].scrollHeight + 200) + "px;overflow-y:hidden;"
    );
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  }
});
</script>
<style lang="scss" scoped>
textarea::placeholder {
  font-family: "WindSong";
  font-weight: 500;
  font-style: italic;
  font-size: 48px;
  text-align: center;
  position: absolute;
  color: #ffffff;
  width: 80%;
  margin: auto;
  left: 10%;
}
.white-logo {
  path {
    fill: white;
  }
}
.msg-bottom-notice {
  color: #909090;
}
</style>