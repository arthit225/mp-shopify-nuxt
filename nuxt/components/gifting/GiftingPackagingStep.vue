<template>
  <section class="gifting-step-1 gifting-packaging-step" >
    <!-- <product-choose-currency-modal
      v-if="!currency"
      :show-modal="!currency"
    /> -->
    <div class="md:flex border-t">
      <div class="flex-1 border-r px-4 pb-10">
        <h1 class="text-center py-10 saol-display-light-italic text-[2.688rem] md:text-[3.25rem] md:leading-[160%]">
          Choose Your Packaging
        </h1>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="product in products" :key="product.id" class="flex-1">
            <lazyload-img
              :widths="[600, 500, 300, 767, 640]"
              :breakpoints="[1400, 1200, 1024, 641, 640]"
              :key="product.node.featuredImage.src"
              :src="product.node.featuredImage.src"
              figureClasses="block w-full h-auto"
              imgClasses="left-0 top-0 w-full h-52 object-cover"
              :aspect-ratio="1"
            />
            <h1 class="flex justify-center items-center h-20 text-center">
              {{ product.node.title }}
            </h1>
              <ClientOnly>
              <button
                :key="product.node.id"
                v-if="product.node.variants.edges[0].node.quantityAvailable >= 1"
                @click="updatePackaging(product.node.id)"
                :class="giftingPackaging === product.node.id ? 'button--black' : 'button--primary'"
                class="w-full"
              >
                {{
                  giftingPackaging === product.node.id
                    ? 'Selected'
                    : 'Select'
                }}
              </button>
              <button
                v-else
                disabled
                class="button--primary w-full"
              >
                Out Of Stock
              </button>
              </ClientOnly>
          </div>
        </div>
      </div>
      <div class="justify-center items-center flex-1 px-4">
        <h1 class="text-center py-10 saol-display-light-italic text-[2.688rem] md:text-[3.25rem] md:leading-[160%]">Your Custom Gift</h1>
          <div v-for="product in products" :key="product.id" class="flex-1 text-center">
            <div v-if="giftingPackaging === product.node.id" class="max-w-[260px] mx-auto relative">
              <button
                @click="removePackaging"
                class="absolute -top-2 -right-2 close-button"
              >
                <IconsCloseX />
              </button>
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
              <GiftingPrice :onlyPackaging="true" />
            </div>
          </div>
      <div class="flex justify-center items-center flex-1 px-4">
        <ClientOnly>
          <button
            ref="nextStepBtn"
            @click="nextStep"
            class="button--black text-center mb-[127px] w-[490px]"
            :disabled="!giftingPackaging"
          >
            Continue to Step 2
          </button>
        </ClientOnly>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStorage } from '@vueuse/core';
const { money } = useUtils();
// const route = useRoute();
const { currency } = useCurrency();
const emit = defineEmits(['update-step'])

const query = `
  query getCollection @inContext(country: ${currency.value}){
    collectionByHandle(handle:"packaging") {
      id
      description
      handle
      title
      image {
        altText
        height
        width
        url
      }
      products(first: 32) {
        edges {
          node {
            handle
            id
            title
            availableForSale
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              src
              id
              height
              altText
              width
            }

            variants(first: 10) {
              edges {
                node {
                  id
                  priceV2 {
                    amount
                    currencyCode
                  }
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  }
`;

const collectionObject = await useShopify({ query });
const products = ref([]);
const nextStepBtn = ref()
const {isReadyToCheckout, giftingPackaging, giftingPackingList} = useGiftCart();


try {
  products.value = collectionObject?.data?.collectionByHandle?.products?.edges;
  giftingPackingList.value = products.value;
} catch (err) {
  console.log(err);
  navigateTo('/404');
}

onMounted(() => {
  console.log(products.value, 'collectionObject');
 
});


function updatePackaging(variantId) {
  giftingPackaging.value = variantId;
  isReadyToCheckout.value = false
}

function nextStep(){
  if(!giftingPackaging.value) return;
  emit('update-step', 2)
}
function removePackaging(){
  giftingPackaging.value = null;
}

</script>
<style lang="scss" scoped>
button.close-button {
  @apply w-[34px] h-[34px] p-2 border border-black;
  border-radius: 100%;
}
</style>
