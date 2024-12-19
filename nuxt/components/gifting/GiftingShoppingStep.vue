<template>
  <section class="gifting-step-2 gifting-shopping-step">
    <!-- <product-choose-currency-modal
      v-if="!currency"
      :show-modal="!currency"
    /> -->
    <div class="md:flex border-t">
      <div class="border-r pb-10 w-full md:w-1/2 relative">
        <GiftingProductSearch
          v-if="openSearch"
          @onSearch="onSearch"
          @toggleSearch="toggleSearch"
          :value="searchString"
          class="absolute z-10 w-full inset-0 h-[86px]"
        />
        <h2
          class="
          text-center
          py-10
          saol-display-light-italic
          text-[2.688rem]
          md:text-[3.25rem]
          md:leading-[160%]
          capitalize
        "
          :class="openSearch ? 'invisible' : ''"
        >
          Choose your items
        </h2>
        <div class="search-or-filter flex uppercase text-sm justify-center gap-[1em] mb-10">
          <label
            class="underline uppercase" 
            @click="toggleFilter()"
            aria-label="Click to sort"
            aria-controls="events-filter__sort"
            data-id="events-filter__sort"
            :class="openFilter ? 'disabled pointer-events-none' : 'cursor-pointer'"  
          >
            Filter
          </label>
          <span> OR </span>
          <label
            class="underline uppercase" 
            :class="openSearch ? 'disabled pointer-events-none' : 'cursor-pointer'"  
            @click="toggleSearch()"
            aria-label="Click to sort"
            aria-controls="events-filter__sort"
            data-id="events-filter__sort">
            Search
          </label>
          <span> PRODUCTS </span>
        </div>
        <GiftingProductFilter
          v-show="openFilter" 
          @onFilter="onFilter"
          @toggleFilter="toggleFilter"
          :checkedCollection="checkedCollection"
          :minPrice="minPrice"
          :maxPrice="maxPrice"
          class="min-h-full"
        />
        <div
          v-show="!openFilter"
          class="
            grid grid-cols-2 md:grid-cols-3 gap-6
            px-6
            max-h-screen overflow-auto
          "
        >
          <template
            v-for="product in search_filtered_products"
            class="flex-1 relative">
            <div v-if="product.node.variants.edges[0].node.quantityAvailable >= 1" :key="product.id">
              <picture class="pt-[100%] block relative">
                <img
                  v-if="product.node.featuredImage"
                  :srcset="product.node.featuredImage.src"
                  :alt="product.node.featuredImage.alt"
                  :width="product.node.featuredImage.width"
                  :height="product.node.featuredImage.height"
                  loading="lazy"
                  class="lazyload blur-up w-full h-full object-contain absolute top-0 left-0"
                />
              </picture>                        
              <h3 class="flex justify-center items-center h-20 text-center">
                {{ product.node.title }}
              </h3>
              <button
                @click="updateProducts(product.node.id)"
                :class="[giftingProductList.includes(product.node.id) ? 'button--black' : 'button--primary']"
                class="w-full"
              >
                {{
                  giftingProductList.includes(product.node.id)
                    ? 'Selected'
                    : 'Select'
                }}
              </button>
            </div>
            
          </template>
        </div>
      </div>
      <div class="justify-center items-center px-4 w-full w-full md:w-1/2">
        <h1 class="text-center py-10 saol-display-light-italic text-[2.688rem] md:text-[3.25rem] md:leading-[160%]">Your Custom Gift</h1>
        <ClientOnly>
          <div v-for="product in giftingPackingList" :key="product.id" class="flex-1 text-center">
            <div v-if="giftingPackaging === product.node.id" class="max-w-[260px] mx-auto relative">
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
          <div class="flex justify-center items-center flex-1 px-4 mb-[70px] ">
            <button
              v-if="!giftingPackaging"
              class="button--black"
              @click="backToStep1"
            >
              BACK TO STEP 1
            </button>
            <button
              v-else
              @click="nextStep"
              class="button--black"
              :disabled="giftingProductList.length?false:'disabled'"
            >
              Continue to Step 3
            </button>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, watch} from "vue"

import { useStorage } from '@vueuse/core';
const { money } = useUtils();
const { currency } = useCurrency();
const emit = defineEmits(['update-step']);
const openSearch = ref(false)
const openFilter = ref(false)
let searchedProducts
let filteredProducts
let query = `
  query getCollection @inContext(country: ${currency.value}){
    collectionByHandle(handle:"gifting-best-sellers") {
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

let collectionObject = await useShopify({ query });
const products = ref([]);
const searchString = ref('')
const checkedCollection = ref([])
const checkedColors = ref([])
const minPrice = ref('')
const maxPrice = ref('')
const search_filtered_products = ref([])
const {isReadyToCheckout, giftingProductList, giftingPackingList, giftingPackaging} = useGiftCart();
try {
  products.value = collectionObject?.data?.collectionByHandle?.products?.edges;
  search_filtered_products.value = products.value
} catch (err) {
  console.error(err);
  navigateTo('/404');
}
function backToStep1() {
  emit("update-step", 1)
}
async function update_search_filtered() {
  if (openSearch.value) {
    if (!searchString.value) {
      search_filtered_products.value = products.value
      return
    }
    search_filtered_products.value = searchedProducts
    return 
  } else if (filteredProducts) {
      search_filtered_products.value = filteredProducts
    return
  }
  search_filtered_products.value = products.value
}
async function onSearch(searched_products, newSearchString) {
  searchedProducts = searched_products
  searchString.value = newSearchString
  await update_search_filtered()
}
async function onFilter(filtered_products, checked_collection, min_price, max_price, checked_colors ) {
  filteredProducts = filtered_products
  checkedCollection.value = checked_collection
  checkedColors.value = checked_colors
  console.log('filteredProducts', filteredProducts, 'min_price', min_price, 'max_price', max_price)
  minPrice.value = min_price
  maxPrice.value = max_price
  await update_search_filtered()
}
onMounted(() => {
  console.log(products.value, 'collectionObject');
});


function updateProducts(variantId) {
  if (
    giftingProductList.value.find((id) => {
      return id == variantId;
    })
  ) {
    giftingProductList.value = giftingProductList.value.filter(
      (id) => id !== variantId
    );
    return;
  }
  isReadyToCheckout.value = false
  giftingProductList.value = [variantId, ...giftingProductList.value];
}

function nextStep() {
  if (giftingProductList.value.length < 1) return;
  emit('update-step', 3);
}
async function toggleFilter() {
  openFilter.value = !openFilter.value
  if (openFilter.value) {
    openSearch.value = false
  }
  await update_search_filtered()
}
async function toggleSearch() {
  openSearch.value = !openSearch.value
  if (openSearch.value) {
    openFilter.value = false
  }
  await update_search_filtered()
}
</script>
<style lang="scss" scoped>
label.disabled {
  color: #909090;
}

</style>