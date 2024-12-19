<template>
<article class="pdp">
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
        <p v-if="showSubscriptionOption && selectedVariant.sellingPlanAllocations.edges[0]?.node.priceAdjustments[0]?.price" class="text-medium leading-[1.375rem] md:leading-[1.688rem]">{{ money(selectedVariant.sellingPlanAllocations.edges[0]?.node.priceAdjustments[0]?.price, true) }}</p>
        <p v-else class="text-medium leading-[1.375rem] md:leading-[1.688rem]">{{ money(selectedVariant.priceV2, true) }}</p>
        <div class="associatedPDP">
          <swiper
            ref="swiperInstance"
            :space-between="0"
            :threshold="20"
            :watch-slides-progress="true"
            :pagination="true"
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
                <ul class="flex flex-wrap gap-y-2 mb-3">
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
            <div class="select-wrapper"> 
              <select v-model="quantity" name="quantity">
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </label>

          <div
            v-if="product.sellingPlanGroups.edges[0]"
            class="pdp-subscription mt-4">

            <div class="flex border border-black py-4 mb-4">
              <div class="flex-1 flex flex-col items-center justify-center border-r-2">
                <label for="subsriptionNo" class="flex flex-col items-center text-center text-xs px-4 cursor-pointer">
                  <span class="mb-2">One time purchase</span>               
                  <input
                    type="radio"
                    name="subscription"  
                    id="subsriptionNo"                  
                    @click="toggleSubscriptionUi(false)"
                    :checked="!showSubscriptionOption ? 'checked' : false"
                  >
                </label> 
              </div>
              <div class="flex-1 flex flex-col items-center justify-center">
                <label for="subsriptionYes" class="flex flex-col items-center text-center text-xs px-4 cursor-pointer">
                  <span class="mb-2">
                    Subscribe and save {{ sellingPlanDiscountPer.toFixed() }}% {{ money(sellingPlanDiscount, true) }}   
                  </span>             
                  <input
                    type="radio"
                    id="subsriptionYes"
                    name="subscription"
                    @click="toggleSubscriptionUi(true)">
                </label>
              </div>              
            </div>

            <div v-if="showSubscriptionOption">
              <label for="sellingPlanOptions"
              class="text-xs mb-1 block">Susbcription Options</label>
              <select
                ref="sellingPlan"
                name="sellingPlanOptions"
                id="sellingPlanOptions"
                class="block border border-black p-2 w-full">
                <option
                  v-for="plan in product.sellingPlanGroups.edges[0].node.sellingPlans.edges"
                  :key="plan.node.id"
                  :value="plan.node.id">
                  {{plan.node.name}}
                </option>
              </select> 
            </div> 
          </div>       
         
          <input type="hidden" name="id" :value="selectedVariantId" />
          <button v-if="product.isSoldOutMessage" type="button" class="w-full uppercase mt-4 button--disabled">
            Coming Soon
          </button>
          <button v-else type="submit" class="w-full uppercase mt-4"
            :class="[selectedVariant.availableForSale ? 'button--black' : 'button--disabled']"
              >
            {{
              selectedVariant.availableForSale ? 'Add To Cart' : 'Unavailable'
            }}
          </button>
        </form>
        <div class="mt-7 md:mt-[80px] mb-4">
          <div class="flex items-center gap-4">
            <input
              type="radio"
              id="ship-to-you"
              name="localPickup"
              v-model="localPickup"
              value="ship_to_you"
            >
            <label for="ship-to-you">
              Ship to you
            </label>
          </div>

          <div class="flex items-center gap-4 mt-5">
            <input
              type="radio"
              id="pickup-in-store"
              name="localPickup"
              v-model="localPickup"
              value="pickup_in_store"
            >
            <label for="pickup-in-store">
              Pick up in store
            </label>
          </div>
          <div v-if="localPickup=='pickup_in_store'">
            <ul             
              v-if="product.variants.edges[0].node.storeAvailability.length > 0"
              class="ml-8 mt-4 opacity-50">
              <li
                
                v-for="item in product.variants.edges[0].node.storeAvailability.edges"
                :key="item.id">
                {{item.node.location.name}} {{item.node.available ? ' - In stock':' - Out of stock'}}
              </li>
            </ul>
            <ul
              v-else
              class="ml-8 mt-4 opacity-50">
              <li>Not avaiable for local pickup</li>
            </ul>
          </div>
          <div class="text-alert mt-4 text-xs">
            ** (Alcohol) Can Only Be Shipped in Canada
          </div>
        </div>

        <div v-if="tabsArray.length > 0" class="product__tabs mt-4">
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
      </div>
    </div>
  </section>
  
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
  </div>
  
  <product-legal-modal
    @close-modal="closeLegalModal"
    :show-modal="showLegalModal"
  />
  <product-choose-currency-modal
    :show-modal="showCurrencyModal"
  />
  
</article>
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

const sellingPlan = ref()
const showSubscriptionOption = ref(false);

const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('product', {
  version: version
});
const showLegalModal = ref(false);
const showCurrencyModal = ref(false)
const component = resolveComponent(story.value.content.component)
const mediaFigure = ref(null);
const localPickup = ref('ship_to_you')
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

const toggleSubscriptionUi = (showOption = false) => {
  showOption ? showSubscriptionOption.value = true : showSubscriptionOption.value = false;
}

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
  checkIfMobile();
  openCurrencyModal()
  window.addEventListener("resize", checkIfMobile);
  selectedVariantFeaturedImage(selectedVariant.value)
});

function openCurrencyModal() {
  console.log(currency.value)
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
    productByHandle(handle:"${route.params.handle}"){
      description
      descriptionHtml
      handle
      title
      vendor
      productType

			sellingPlanGroups(first: 50)  {
				edges {					
					node {
						sellingPlans(first: 100) {
							edges {
								node {
 									id
                  name
                  description
                  recurringDeliveries
                  priceAdjustments {
                    adjustmentValue
                  }
                  options {
                    name
                    value
                  }
									
								}
							}
						}
					}
				}
			}

      metafields(identifiers: [
        {namespace: "custom", key: "show_sold_out_message"},
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
						storeAvailability(first: 100) {
							edges {
									node {
											available										
											location {
													id
													name
											}
									}
							}
						}            
            sellingPlanAllocations(first: 1)  {
              edges {
                node {
                  priceAdjustments {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
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

console.log("the query=========", query)
const productData = await useShopify({ query });

let product = null;

try {
  product = productData.data.productByHandle;
  console.log("storeAvailability", JSON.stringify(product) )

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
  console.log('sellingPlanAllocations', product.variants.edges[0].node.sellingPlanAllocations)
  return product.variants.edges[0].node;
}

const legalValue = useCookie('legalValue')
if(legalValue.value == undefined && product.productType.toLowerCase() == 'alcohol') {
  showLegalModal.value = true;
} else {
  openCurrencyModal()
}

const { addToCart } = useCart();
const quantity = ref(1);
const options = product.options;
const selectedVariant = ref(firstAvailableVariant(product));
const selectedVariantId = computed(() => {
  return selectedVariant.id;
});

function productMetafields() {
  const obj = {};
  obj.title = "description";
  obj.description = product.descriptionHtml;
  tabsArray.value.push(obj);

  product.isSoldOutMessage = false
  product.metafields.forEach((field) => {
    if (field && field.key == "subtitle") {
      subtitle.value = field.value;
    }

    if (field && field.key == "show_sold_out_message") {
      product.isSoldOutMessage = field.value == 'true' || field.value == true ? true : false;
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

const sellingPlanDiscountPer = ref(null)
const sellingPlanCalculateDiscount = () => {
  const amount = parseFloat(selectedVariant.value.price) - parseFloat(selectedVariant.value.sellingPlanAllocations.edges[0]?.node.priceAdjustments[0]?.price?.amount)
  sellingPlanDiscountPer.value = (amount * 100) / parseFloat(selectedVariant.value.price)
  return {
    amount : amount.toFixed(2),
    currencyCode : currency.value
  }
}
const sellingPlanDiscount = ref(sellingPlanCalculateDiscount())

console.log(sellingPlanDiscountPer.value)
const addToCartIsLocked = ref(false);
let sellPlanId = null
async function handleAddToCartForm() {
  if (sellingPlan.value?.value) {
    sellPlanId = sellingPlan.value.value
  } else {
    sellPlanId = null
  }
  if (addToCartIsLocked.value === true) return;
  if (!selectedVariant.value.availableForSale) return;

  addToCartIsLocked.value = true;
  await addToCart([
    { 
      quantity: quantity.value,
      merchandiseId: selectedVariant.value.id,
      sellingPlanId: sellPlanId
     },
  ]);
  addToCartIsLocked.value = false;
}

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
.text-alert {
  color: var(--mp-coral);
}
.select-wrapper {
  position: relative;
  display: inline-block;
  width: 3.5rem;
  pointer-events: none;
  select {
    -webkit-appearance: none;
    width: 100%;
    padding: 0 0.5rem;
    pointer-events: auto;
  }
  // &:after {
  //       border-bottom: 1px solid #000;
  //   border-right: 1px solid #000;
  //   content: "";
  //   display: block;
  //   height: 0.5rem;
  //   margin-top: -3px;
  //   position: absolute;
  //   right: 0.5rem;
  //   top: 50%;
  //   transform: rotate(45deg) translateY(-50%);
  //   transform-origin: 50% 0;
  //   transition: all .4s ease-in-out;
  //   width: 0.5rem;
  // }
}
</style>
