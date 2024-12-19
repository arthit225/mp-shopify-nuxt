<template>
<div v-if="relatedProductsArray && relatedProductsArray.length > 0">
  <!-- <product-choose-currency-modal
    :show-modal="!currency"
  /> -->
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="four-up featured-products tracking-[2px] futura-std-medium pb-[6.25rem] md-down:pb-16 mt-36"
  >
    <header
      v-if="blok.title && relatedProductsArray && relatedProductsArray.length > 0"
      class="flex gap-4 px-4 md:px-8 leading-normal tracking-[2px] mb-7 md-down:mb-3"
    >
      <h2 class="futura-std-medium heading-xs uppercase">
        {{ blok.title }}
      </h2>
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
      <swiper-slide v-for="product in relatedProductsArray" :key="product.id">
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
            <p class="text-xs mb-3 md-down:mb-2 slug-xs">
              {{ product.vendor }}
            </p>
            <div class="flex flex-col justify-between flex-1 px-3">
              <nuxt-link :to="`/product/${product.handle}`" class="block mb-2">
                <div
                  v-if="product.title"
                  class="md-down:text-sm md-down:leading-[1.25rem] uppercase  max-h-[40px] md:max-h-[47px] overflow-hidden"
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
</div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
const { money } = useUtils();
const { currency } = useCurrency();
const route = useRoute();
const { blok } = defineProps({ blok: Object });
const state = reactive({
  fullProducts: [],
});
const relatedProductsArray = ref([]);
const relatedProductsTempArray = ref([]);

const query = `
  query productDetails @inContext(country: ${currency.value?currency.value:'US'}){
    productByHandle(handle:"${route.params.handle}"){
      description
      descriptionHtml
      handle
      title
      vendor
      metafields(identifiers: [ 
        {namespace: "custom", key: "related_products"}, 
        {namespace: "custom", key: "first_tab"},
        {namespace: "custom", key: "second_tab"},
        {namespace: "custom", key: "third_tab"},
        {namespace: "custom", key: "four_tab"},
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
            priceV2 {
              amount
              currencyCode
            }
            id
            price {
							amount
							currencyCode
						}
            quantityAvailable
            title
            sku
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options(first: 10) {
        name
        values
      }
      media(first: 10) {
        edges {
          node {
            mediaContentType
            alt
            ... on MediaImage {
              id
              image {
                src
                originalSrc
                width
                height
                altText
              }
            }
            ... on Video {
              id
              alt
              sources {
                format
                height
                mimeType
                url
                width
              }
            }
          }
        }
      }
    }
  }
`;

const productData = await useShopify({ query });

let product = null;

try {
  product = productData.data.productByHandle;
  await productMetafields(product);
} catch (err) {
  console.log(err);
  navigateTo('/404');
}

async function productMetafields(product) {
  product.isSoldOutMessage = false
  product?.metafields.forEach((field) => {
    if (field && field.key == "show_sold_out_message") {
      product.isSoldOutMessage = field.value == 'true' || field.value == true ? true : false;
    }

    if (field && field.key === "related_products") {
      JSON.parse(field.value).forEach((id) => {
        relatedProductsTempArray.value.push(btoa(id));
      });

     const query = `query getProducts($ids: [ID!]!) {
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
        ids: relatedProductsTempArray.value,
      };

      useShopify({ query, variables }).then((dataa) => {
        relatedProductsArray.value = dataa.data.nodes;
        for (let i = 0; i < relatedProductsArray.value.length; i++) {
            productMetafields(relatedProductsArray.value[i]);
            if(!relatedProductsArray.value[i] ){
                relatedProductsArray.value.splice(i,1)
                i--;
            }
        }
      });
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
.related-product {
 margin-top: 130px;
}
</style>
