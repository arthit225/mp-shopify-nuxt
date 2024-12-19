<template>
<div>
  <section class="px-4 md:py-10">
    <div class="lg:flex max-w-full flex-wrap xl:m-24">
     
      <div v-if="product.media.edges.length > 0" class="lg:w-2/3 max-w-full lg:pr-4 xl:pr-28 pb-6 lg:pb-0">
        <div v-if="!isMobileSwiper">
          <figure
            v-for="(media, index) in product.media.edges"
            :key="media.id"
            class="product__media-figure md:mb-4"
            :class="['product-media-' + index]"
            :data-alt="media.node.image?.altText"
            ref="mediaFigure"
          >
            <lazyload-img
              v-if="media.node.mediaContentType == 'IMAGE'"
              :widths="[900, 700, 768, 640]"
              :breakpoints="[1200, 1024, 768, 640]"
              :key="media.id"
              :width="media.node.image.width"
              :height="media.node.image.height"
              :src="media.node.image.src"
              :alt="media.node.image.altText ? media.node.image.altText : product.title"
              imgClasses="block object-cover lazyload blur-up"
              :absolute="true"
              :force-ratio="{
                aspectRatio: 0.77,
                force: false
              }" />

            <PlayPauseVideo v-else :key="'video-' + media.id" :preload="'metadata'" :muted="true" :loop="true"
              :playsinline="true" :classes="'block w-full h-auto'">
              <source :src="media.node.sources[0].url" />
            </PlayPauseVideo>
          </figure>
        </div>

        <swiper
          class="lg-down:!-mx-4 pdp-swiper"
          v-else-if="productData && isMobileSwiper"
          :key="product.id + '' + isMobileSwiper" ref="swiperRef"
          :preload-images="true"
          :slides-per-view="1"
          :auto-height="true"
          :threshold="20"
          :modules="modules"
          :pagination="true"
          @swiper="onSwiper"
          :class="[isMobileSwiper ? 'pdp-mobile-swiper' : '']"
        >
          <swiper-slide
            v-for="(media, index) in product.media.edges"
            :key="media.id"
          >
            <figure
              class="product__media-figure"
              :class="['product-media-' + index]"
              :data-index="index"
              :data-alt="media.node.image?.altText"
              ref="mediaFigure"
            >
              <lazyload-img
                v-if="media.node.mediaContentType == 'IMAGE'"
                :widths="[700, 600, 768, 640]"
                :breakpoints="[1200, 1024, 768, 640]"
                :key="media.id"
                :width="media.node.image.width"
                :height="media.node.image.height"
                :src="media.node.image.src"
                :alt="
                  media.node.image.altText ? media.node.image.altText : product.title
                "
                imgClasses="block object-cover lazyload blur-up"
                :absolute="true"
                :force-ratio="{
                  aspectRatio: 0.77,
                  force: true
                }" />

              <PlayPauseVideo v-else :key="'video-' + media.id" :preload="'metadata'" :muted="true" :loop="true"
                :playsinline="true" :classes="'block w-full h-auto'">
                <source :src="media.node.sources[0].url" />
              </PlayPauseVideo>
            </figure>
          </swiper-slide>
        </swiper>
      </div>


      <div
        class="flex-1 flex flex-col gap-y-4 mx-auto w-full lg:w-1/3 mb-auto sticky top-24 "
      >
        <h2 class="futura-std-medium slug-m uppercase">{{ product.title }}</h2>
        <p class="text-medium leading-[1.375rem] md:leading-[1.688rem]">{{ money(selectedVariant.priceV2) }}</p>

        <div class="associatedPDP">
          <swiper
            ref="swiperInstance"
            :space-between="0"
            :threshold="20"
            :watch-slides-progress="true"
            :pagination="pagination"
            @swiper="onSwiper"
            class="max-w-[800px]"
          >
            <swiper-slide
              v-for="itemProduct in associatedProductsArray" :key="itemProduct.id"
              class="p-3"
            >
              <div
                class="relative mx-auto"
              >
                <nuxt-link
                    :to="`/product/${itemProduct.handle}`"
                    class="block mb-4 md-down:mb-2.5"
                  >
                    <lazyload-img
                      :key="itemProduct.media.edges[0].node.image.src"
                      :src="itemProduct.media.edges[0].node.image.src"
                      :width="itemProduct.media.edges[0].node.image.width"
                      :height="itemProduct.media.edges[0].node.image.height"
                      figureClasses="ratio-container block max-w-[20px] mb-4 md-down:mb-2.5"
                      pictureClasses="w-full h-full block"
                      imgClasses="block object-cover"
                      :absolute="true"
                      :forceRatio="{
                        force: true,
                        aspectRatio: 0.8
                      }"
                    />
                  </nuxt-link>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <form
          @submit.prevent="handleAddToCartForm"
          class=""
        >
          <div class="-mt-4">
            <div
              v-for="(option, index) in options"
              :key="option.name"
              class="flex flex-col"
            >
              <div v-if="option.name != 'Title'">
                <h1 class="mr-4 text-extra-small mb-2">{{ option.name }}</h1>
                <ul class="flex mb-3">
                  <li
                    v-for="valueName in option.values"
                    :key="valueName"
                    @click="
                      updateSelectedVariant({
                        name: option.name,
                        value: valueName,
                        index,
                      })
                    "
                    class="cursor-pointer mr-1 4 button--primary"
                    :class="{
                      'button--black':
                        selectedVariant.selectedOptions[index].value ===
                        valueName,
                    }"
                  >
                    {{ valueName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <label for="quantity" class="block mx-auto mt-4">
            Quantity:
            <select v-model="quantity" name="quantity">
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
         
          <input type="hidden" name="id" :value="selectedVariantId" />
          <div v-if="tabsArray.length > 0" class="product__tabs mt-10">
            <ul>
              <accordion-item
                v-for="(item, index) in tabsArray"
                :item="item"
                :index="index + 1"
                :key="index + 1"
                :scroll="false"
              >
              </accordion-item>
            </ul>
          </div>
          <div>
            <h3 class="my-4 text-extra-small mb-2 uppercase">
              Add your message
            </h3>
            <textarea
              maxlength="50"
              class="
               w-full border border-black
               resize-none
              "
              v-model="giftingMessage"
              rows="5"
            >
            </textarea>
          </div>
          <button type="submit" class="w-full uppercase mt-4"
            :class="[selectedVariant.availableForSale ? 'button--black' : 'button--disabled']"
              >
            {{
              selectedVariant.availableForSale ? 'Add To Cart1' : 'Unavailable'
            }}
          </button>
        </form>
        
      </div>
    </div>
  </section>
  <div> <component :is="component" v-if="story" :blok="story.content" /></div>
  <product-legal-modal
    @close-modal="closeLegalModal"
    :show-modal="showLegalModal"
  />
  <!-- <product-choose-currency-modal
    :show-modal="showCurrencyModal"
  /> -->
  </div>
</template>

<script setup>
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
const modules = [Pagination];
let isMobileSwiper = ref(false);
const { money } = useUtils();
const route = useRoute();
const { currency } = useCurrency();
const descriptionArray = ref([]);
const router = useRouter();
const tabsArray = ref([]);
const relatedProductsArray = ref([]);
const relatedProductsTempArray = ref([]);
const associatedProductsArray = ref([]);
const associatedProductsTempArray = ref([]);

const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('product', {
  version: version
});
const showLegalModal = ref(false);
const showCurrencyModal = ref(false)
const component = resolveComponent(story.value.content.component)
const mediaFigure = ref(null);
const swiperr = ref(null);

const onSwiper = (swiper) => {
  console.log(swiper);
  swiperr.value = swiper
  selectedVariantFeaturedImage(selectedVariant.value)
};

const checkIfMobile = (swiper) => {
  if (window.innerWidth < 1024) {
    isMobileSwiper.value = true;
  } else {
    isMobileSwiper.value = false;
  }
};

const selectedVariantFeaturedImage = (selectedVariant) => {
  mediaFigure.value.forEach((media) => {
    if (media.dataset.alt && media.dataset.alt === selectedVariant.image.altText ) {
      if (!isMobileSwiper.value) {
        window.scroll({
          top: media.offsetTop - 72,
          left: 0,
          behavior: 'smooth'
        })
      } else {
        swiperr.value ? swiperr.value.slideTo(media.dataset.index) : ''
      }
    }
  })
}

onMounted(async () => {
  const legalValue = useCookie('legalValue')
  if(legalValue.value == undefined) {
    showLegalModal.value = true;
  } else {
    openCurrencyModal()
  }
    
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  selectedVariantFeaturedImage(selectedVariant.value)
});
function openCurrencyModal() {
  if (currency.value == undefined) {
    showCurrencyModal.value = true;
  }
}
function closeLegalModal() {
  showLegalModal.value=false;
  openCurrencyModal();
}
const query = `
  query productDetails @inContext(country: ${currency.value?currency.value:'US'}){
    productByHandle(handle:"gift-card"){
      description
      descriptionHtml
      handle
      title
      vendor
      metafields(identifiers: [ 
        {namespace: "custom", key: "related_dose_article"},
        {namespace: "custom", key: "associated_products"},
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
            image {
              altText
              id
            }
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
                xl: url(transform: { maxWidth: 2000})
                l: url(transform: { maxWidth: 1200})
                m: url(transform: { maxWidth: 1024})
                s: url(transform: { maxWidth: 768})
                xs: url(transform: { maxWidth: 10})
                url(transform: { maxWidth: 1200})
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

} catch (err) {
  console.log(err);
  navigateTo('/404');
}

function firstAvailableVariant(product) {
  product.variants.edges.forEach((variant) => {
    if (variant.node.availableForSale) {
      return variant.node;
    }
  });
  return product.variants.edges[0].node;
}

const { addToCart } = useCart();
const quantity = ref(1);
const giftingMessage = ref('');
const options = product.options;
const selectedVariant = ref(firstAvailableVariant(product));
const selectedVariantId = computed(() => {
  return selectedVariant.id;
});

function productMetafields() {
  const obj = {};
  obj.title = "description";
  obj.description = product.description;
  tabsArray.value.push(obj);

  product.metafields.forEach((field) => {
    if (field && field.key == "subtitle") {
      subtitle.value = field.value;
    }

    if (field && field.key.includes("_tab")) {

      const obj = {};
      obj.title = field.value.split("\n\n")[0];
      obj.description = field.value.split("\n\n")[1];
      tabsArray.value.push(obj);
    }

    if (field && field.key == "product_number") {
      productNumber.value = field.value;
    }

    if (field && field.key === "related_products") {
      JSON.parse(field.value).forEach((id) => {
        relatedProductsTempArray.value.push(btoa(id));
      });

      const query = `query productByIds($ids: [ID!]!) {
                      nodes(ids: $ids) {
                        ... on Product {
                          id
                          title
                          handle
                          media(first: 1) {
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
                    }
                    `;
      const variables = {
        ids: relatedProductsTempArray.value,
      };

      useShopify({ query, variables }).then((dataa) => {
        relatedProductsArray.value = dataa.data.nodes;
      });
    }

    if (field && field.key === "associated_products") {
      JSON.parse(field.value).forEach((id) => {
        associatedProductsTempArray.value.push(btoa(id));
      });

      const query = `query productByIds($ids: [ID!]!) {
                      nodes(ids: $ids) {
                        ... on Product {
                          id
                          title
                          handle
                          media(first: 1) {
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
                    }
                    `;
      const variables = {
        ids: associatedProductsTempArray.value,
      };

      useShopify({ query, variables }).then((dataa) => {
       associatedProductsArray.value = dataa.data.nodes;
      });
    }
  });
}

productMetafields();

function updateSelectedVariant(option) {
  let variantUpdated = false;
  product.variants.edges.forEach((edge) => {
    if (variantUpdated) return;
    const variant = edge.node;
    let found = true;
    variant.selectedOptions.forEach((singleOption, index) => {
      if (index == option.index) {
        if (singleOption.value !== option.value) found = false;
      } else {
        if (
          selectedVariant.value.selectedOptions[index].value !==
          singleOption.value
        )
          found = false;
      }
    });
    if (!found) return;
    selectedVariant.value = variant;
    variantUpdated = true;
  });

  selectedVariantFeaturedImage(selectedVariant.value)
}

const addToCartIsLocked = ref(false);

async function handleAddToCartForm() {
  if (addToCartIsLocked.value === true) return;
  if (!selectedVariant.value.availableForSale) return;

  addToCartIsLocked.value = true;
  const lineItems = [];
  lineItems.push (
    {
      quantity: quantity.value,
      merchandiseId: selectedVariant.value.id,
      attributes: [
        {
          key: 'message',
          value: giftingMessage.value,
        },
    ],
    }
  )
  await addToCart(lineItems);
  addToCartIsLocked.value = false;
}

// Jsonld script
useJsonld(() => ({
  "@context": 'https://schema.org',
  "@type": 'Product',
  "name": product.title,
  "url": route.fullPath,
  "description": product.description,
  "sku": selectedVariant.value.sku,
  "brand": {
    "@type": "Brand",
    "name": product.vendor
  }
}));
</script>

<style lang="scss" scoped>
.pdp-swiper {
  .swiper-pagination {
    display: flex;
    padding: 0 1rem;
  }
}
.associatedPDP{
  .swiper {
    margin-left: toRem(-10);
    .swiper-slide {
      width: 80px !important
    }
  }
}
</style>
