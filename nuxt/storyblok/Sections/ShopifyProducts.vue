<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="four-up featured-products tracking-[2px] futura-std-medium pb-[6.25rem] md-down:pb-16"
  >
    <header
      v-if="blok.title || blok.see_all_link.url"
      class="flex gap-4 px-4 md:px-8 leading-normal tracking-[2px] mb-7 md-down:mb-3"
    >
      <h2 class="futura-std-medium heading-xs uppercase">
        {{ blok.title }}
      </h2>
      <div v-if="blok.see_all_link" class="flex-1 text-right text-extra-small">
        <nuxt-link
          :to="
            blok.see_all_link.url
              ? blok.see_all_link.url
              : blok.see_all_link.cached_url
              ? '/' + blok.see_all_link.cached_url
              : '/'
          "
          class="underline"
        >
          {{ blok.see_all_link_text }}
        </nuxt-link>
      </div>
    </header>

    <swiper
      ref="swiperInstance"
      :slides-per-view="1.5"
      :space-between="25"
      :threshold="20"
      :watch-slides-progress="true"
      :breakpoints="{
        '768': {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 3.5,
        },
        '1280': {
          slidesPerView: 4,
        },
      }"
    >
      <swiper-slide v-for="product in state.fullProducts" :key="product.id">
        <div class="h-full flex flex-col">
          <div
            class="relative mx-auto four-up__item text-center bg-mp-off-white w-full flex flex-col flex-1 md-down:pb-4 pb-5"
          >
            <nuxt-link
              :to="`/product/${product.handle}`"
              class="block mb-4 md-down:mb-2.5"
            >
              <lazyload-img
                :widths="[400, 350, 300, 500]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="product.featuredImage.src"
                :src="product.featuredImage.src"
                figureClasses="ratio-container block max-w-full"
                pictureClasses="w-full h-full block"
                imgClasses="block object-cover"
                :absolute="true"
                :forceRatio="{
                  force: true,
                  aspectRatio: 0.8
                }"
              />
            </nuxt-link>
            <p class="text-xxs mb-3 md-down:mb-2 slug-xs">
              {{ product.vendor }}
            </p>
            <div class="flex flex-col justify-between flex-1 px-3">
              <nuxt-link
                :to="`/product/${product.handle}`"
                class="block mb-2 mx-auto max-w-xs xl:max-w-[15rem]">
                <div
                  v-if="product.title"
                  class="md-down:text-sm md-down:leading-[1.25rem] uppercase max-h- max-h-[40px] md:max-h-[47px] overflow-hidden"
                >
                  {{ product.title }}
                </div>
              </nuxt-link>
              <p class="text-xs">
                {{ money(product.priceRange.minVariantPrice) }}
              </p>
            </div>
          </div>

          <div class="item-action mt-9">
            <div v-if="product.variants.edges.length > 1">
              <nuxt-link
                :to="`/product/${product.handle}`"
                class="button--primary w-full uppercase block"
              >
                Shop Now
              </nuxt-link>
            </div>
            <div v-else>
              <button
                v-if="is_sold_out(product.variants.edges[0].node)"
                class="button--disabled w-full uppercase"
              >
                <span v-if="product?.isSoldOutMessage">
                  Coming Soon
                </span>
                <span v-else>
                  Sold Out
                </span>
              </button>
              <button
                v-else
                @click.prevent="
                  handleAddToCartForm(product.variants.edges[0].node)
                "
                class="button--primary w-full uppercase"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
const { money } = useUtils();

const { blok } = defineProps({ blok: Object });
const state = reactive({
  fullProducts: [],
});

onMounted(async () => {
  const ids = [];
  console.log("blokky", blok);
  blok.products.items.forEach(el => {
    if(el) {
      ids.push(el.id)
    }
  });
  console.log(ids);

  const query = `
    query getProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          vendor
          metafields(identifiers: [
            {namespace: "custom", key: "show_sold_out_message"},
          ])
          { 
            type 
            namespace 
            key
            value
          }
          variants(first: 50) {
            edges {
              node {
                currentlyNotInStock
                availableForSale
                id
                quantityAvailable
              }
            }
          }
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
        }
      }
    }`;

  const variables = {
    ids: ids,
  };

  const responseData = await useShopify({ query, variables });
  console.log(responseData);

  responseData.data.nodes.forEach((e) => {
    if (e) {
      productMetafields(e)
      state.fullProducts.push(e)
    }
  });
  console.log(state.fullProducts);
});

async function productMetafields(product) {
  product.isSoldOutMessage = false
  product?.metafields?.forEach((field) => {
    if (field && field.key == "show_sold_out_message") {
      product.isSoldOutMessage = field.value == 'true' || field.value == true ? true : false;
    }
  });
}

const { addToCart } = useCart();

function is_sold_out(product) {
  return (product.availableForSale)? false: true
}

const addToCartIsLocked = ref(false);

async function handleAddToCartForm(product) {
  if (addToCartIsLocked.value === true) return;
  if (!product.availableForSale) return;

  addToCartIsLocked.value = true;
  await addToCart([
    { quantity: 1, merchandiseId: product.id },
  ]); 
  addToCartIsLocked.value = false;
}

async function is_solid_out(id) {
  if (addToCartIsLocked.value === true) return;

  addToCartIsLocked.value = true;
  const resp = await addToCart([{ quantity: 1, merchandiseId: id }]);
  addToCartIsLocked.value = false;
}
</script>

<style lang="scss">
.four-up {
  .ratio-container {
    &__video {
      aspect-ratio: 0.8;
    }
  }
  .swiper {
    padding: 0 2rem;
    @screen md-down {
      padding: 0 1rem;
    }
    .swiper-slide {
      height: auto;
    }
  }
  &.featured-products {
    img {
    
    }
  }
}
</style>
