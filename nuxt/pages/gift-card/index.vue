<template>
  <div ref="giftcardRef">
    <section class="px-4 py-10 gift-card">
      <div class="flex flex-wrap lg:m-24 flex-col lg:flex-row">
        <div 
          ref="leftSideRef"
          v-if="product.media.edges.length > 0"
          class="lg:w-2/3 max-w-full lg:pr-4 xl:pr-28 pb-6 lg:pb-0"
        >
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
          ref="rightSideRef"
          class="flex-1 flex flex-col gap-y-4 mx-auto w-full lg:w-1/3 mb-auto lg:sticky lg:top-48"
        >
          <h2 class="futura-std-medium slug-m uppercase">GIFT CARD</h2>
          <!--p class="text-extra-small">
            The e-gift card will arrive within 24 hours via email<br>once the order is placed</p-->
          <form
            class="rounded py-4" @submit.prevent="isPhysical ? handleAddToCartForm() : handleCheckoutZenotiGift()"
            :class="{
              disabled: ZenotiStep>0
            }"
          >
            <div class="pt-2">
                <div class="flex flex-col">               
                  <label class="mr-4 slug-xs mb-2">TYPE</label>
                  <div class="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      class="w-full uppercase mt-4 button--primary"
                      :class="[!isPhysical ? 'button--black' : '']"
                      @click="isPhysical = false"
                    >
                      DIGITAL
                    </button>
                    <button 
                      type="button" 
                      class="w-full uppercase mt-4 button--primary"
                      :class="[isPhysical ? 'button--black' : '']"
                      @click="isPhysical = true"
                    >
                      PHYSICAL
                    </button>
                  </div>  
                  <h1 class="mr-4 slug-xs mb-2 mt-12">BY</h1>
                  <div class="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      class="w-full uppercase mt-4 button--primary"
                      :class="[!isPhysical && byAmount ? 'button--black' : '']"
                      @click="byAmount=true"
                    >
                      AMOUNT
                    </button>
                    <button
                      v-if="!isPhysical"
                      type="button"
                      class="w-full uppercase mt-4 button--primary"
                      :class="[!byAmount ? 'button--black' : '']"
                      @click="byAmount=false"
                    >
                      Services
                    </button>
                    <!--button v-if="!isPhysical" type="button" class="w-full uppercase mt-4 button--primary">
                      TREATMENT
                    </button-->
                  </div>
                  <div
                    v-if="byAmount|| isPhysical"
                    class="mt-8 grid gap-y-4"
                  >
                    <div
                      v-for="(option, index) in options"
                      :key="option.name"
                      class="flex flex-col"
                    >
                      <div v-if="option.name != 'Title' && (isPhysical||option.name === 'Size')">
                        <!-- <h1 class="mr-4 text-extra-small mb-2">{{ option.name }}</h1> -->
                        <ul class="flex flex-wrap -m-2">
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
                            class="cursor-pointer m-2 button--primary w-[52px] !px-1"
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
                  <div
                    v-if="!isPhysical && !byAmount"
                    class="services"
                  >
                    <div
                      class="flex flex-col mt-4"
                    >
                      <ul class="flex flex-wrap -m-2">
                        <li
                          v-for="(service)  in servicesOfCenter"
                          :key="service.code"
                          @click="selectedService=service.id"
                          class="cursor-pointer m-2 button--primary !px-1"
                          :class="{
                            'button--black':
                              selectedService === service.id,
                          }"
                        >
                          {{ service.name }} {{ priceString(service?.price_info) }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                 <div v-if="isPhysical && tabsPhysicalArray.length > 0" class="product__tabs mt-14">
                  <ul>
                    <accordion-item
                      v-for="(item, index) in tabsPhysicalArray"
                      :item="item"
                      :index="index + 1"
                      :useRichText="false"
                      :key="index + 1"
                      :scroll="false"
                    >
                    </accordion-item>
                  </ul>
                </div>
                <div v-if="!isPhysical && tabsArray.length > 0" class="product__tabs mt-14">
                  <ul>
                    <accordion-item
                      v-for="(item, index) in tabsArray"
                      :item="item"
                      :index="index + 1"
                      :useRichText="true"
                      :key="index + 1"
                      :scroll="false"
                    >
                    </accordion-item>
                  </ul>
                </div>
                <div  v-if="!isPhysical" class="mt-14">
                  <label class="mr-4 slug-xs block mb-4">LOCATION</label>
                  <select
                    class="
                      p-2
                      border-b
                      border-black
                      cursor-pointer
                      mb-2.5
                      leading-none
                      relative
                      default
                      w-full
                      text-left
                    "
                    v-model="centerID">
                    <option
                      v-for="(location, index) in centerData"
                      :key="location.id"
                      :value = "index"
                    >
                      {{ location.name }}
                    </option>
                  </select>
                </div>
                <div v-if="!isPhysical" class="mt-14">
                  <label class="mr-4 slug-xs block mb-4">
                    WHO'S IT FOR?
                    <span class="text-xs font-normal text-">* required</span>
                  </label>
                  <div class="flex flex-wrap lg:gap-4">
                    <div class="w-full lg:flex-1 gift-card__input-field ">
                      <span 
                        v-if="v$.toUser.$error && !isPhysical"
                        class="block errors futura-std-regular text-red-500 text-left"
                      >
                        {{ v$.toUser.$errors[0].$message }}
                      </span>
                      <input
                        class="block w-full default mb-5 slug-xs mr-2.5"
                        autocomplete="on"
                        name="to"
                        id="to"
                        placeholder="TO"
                        :class="
                          v$.toUser.$errors.length > 0  && !isPhysical ? '!border-red-600 !border' : ''
                        "
                        v-model="state.toUser"
                      />
                    </div>
                    <div class="w-full lg:flex-1 gift-card__input-field ">
                    <span 
                      v-if="v$.fromUser.$error && !isPhysical"
                      class="ml-2.5 block errors futura-std-regular text-red-500 text-left"
                    >
                      {{ v$.fromUser.$errors[0].$message }}
                    </span>
                    <input
                      class="block w-full default mb-5 slug-xs"
                      autocomplete="on"
                      name="to"
                      id="to"
                      :class="
                        v$.fromUser.$errors.length > 0  && !isPhysical ? '!border-red-600 !border' : ''
                      "
                      placeholder="FROM"
                      v-model="state.fromUser"
                    />
                    </div>
                  </div>
                  <div class="gift-card__input-field flex-1">
                    <span 
                      v-if="v$.toEmail.$error && !isPhysical"
                      class="block errors futura-std-regular text-red-500 text-left"
                    >
                      {{ v$.toEmail.$errors[0].$message }}
                    </span>
                    <input
                        class="block w-full default slug-xs mb-3"
                        autocomplete="on"
                        name="to"
                        id="to"
                        type="email"
                        :class="
                          v$.toEmail.$errors.length > 0 && !isPhysical ? '!border-red-600 !border' : ''
                        "
                        placeholder="RECIPENT'S EMAIL"
                        v-model="state.toEmail"
                      />
                    </div>
                </div>
                <div class="mt-14">
                  <label class="mr-4 slug-xs block mb-4">ADD YOUR MESSAGE</label>
                  <div class="gift-card__input-field flex-1">
                    <span 
                      v-if="v$.giftingMessage.$error && !isPhysical"
                      class="block errors futura-std-regular text-red-500 text-left"
                    >
                      {{ v$.giftingMessage.$errors[0].$message }}
                    </span>
                    <textarea
                      
                      maxlength="100"
                      class="
                        w-full text-left
                        border-black border
                        outline-0
                        resize-none
                        h-24
                        p-3
                        slug-xs
                      "
                      placeholder="0/100 WORDS"
                      :class="
                        v$.giftingMessage.$errors.length && !isPhysical > 0 ? '!border-red-600 !border' : ''
                      "
                      v-model="state.giftingMessage"
                    />
                   </div>
                </div>
                <!--div v-if="!isPhysical" class="mt-14">
                  <label class="mr-4 slug-xs block mb-4">PICK YOUR DELIVERY DATE:</label>
                  <input
                    class="block w-full default slug-xs mb-3"
                    autocomplete="on"
                    name="to"
                    id="to"
                    placeholder=""
                    v-model="deliveryDate"
                  />
                </div-->
                <input type="hidden" name="id" :value="selectedVariantId" />
                <div class="mt-14">
                  <button v-if="isPhysical" type="submit" class="w-full uppercase"
                    :class="[selectedVariant.availableForSale ? 'button--black' : 'button--disabled']"
                      >
                    {{
                      selectedVariant.availableForSale ? 'Add To Bag' : 'Unavailable'
                    }}
                  </button>
                  <template v-else>
                    <button
                      v-if="ZenotiStep===0"
                      type="submit"
                      class="w-full uppercase"
                      :class="'button--black'"
                    >
                      Check Out
                    </button>

                  </template>
                </div>
            </div>
          </form>
          <div
            ref="checkoutIframe"
          >
            <div v-if="!isPhysical && ZenotiStep>0">
              <div>
                <button
                  class="w-full uppercase"
                  :class="'button--black'"
                  @click="stopZenoti" 
                >
                  Select Another
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <component :is="component" v-if="story" :blok="story.content" />
    </div>
    <SnippetsBackgroundBlocker
      :zIndex="99"
      v-if="ZenotiRunning || ZenotiStep >= 4"
      @click.self="stopZenoti"
    >
      <div
        class="fixed w-[95%] h-[95%] md:w-[50%] md:h-[50%] max-w-[640px] max-h-[640px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-10 cursor-auto overflow-auto p-4"
      >
        <div
          class="w-full h-full flex flex-col justify-center items-center relative"
        >
          <button @click="stopZenoti" class="absolute top-0 right-0 w-5 h-5">
            <IconsCloseX />
          </button>
          <div
            class="flex flex-col gap-2 justify-center items-center"
          >
            <template v-if="ZenotiRunning">
              <GiftingSpinner />
              Creating your gifts...
            </template>
            <p class="uppercase mb-3 tracking-wide">
              {{ ZenotiStatusText }}
            </p>
          </div>
          <iframe
            v-show="ZenotiStep>=4" 
            
            :class="ZenotiStep>=4?'h-[500px]':'h-0'"
            class="w-full max-h-full"
            :src="checkoutUrl"
          />
        </div>
      </div>
    </SnippetsBackgroundBlocker>    
  </div>
</template>

<script setup>
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import {useVuelidate} from '@vuelidate/core';
import {
  required,
  email as emailValidator,
  helpers,
} from '@vuelidate/validators';
const { priceString } = useZenotiUtils()

// using the default server
// Form data
const state = reactive({
  toUser: '',
  fromUser: '',
  toEmail: '',
  giftingMessage: ''
});

// Form Validation Rules
const rules = {
  toUser: {
    required: helpers.withMessage(
      'This field cannot be empty',
      required
    ),
  },
  fromUser: {
    required: helpers.withMessage(
      'This field cannot be empty',
      required
    ),
  },
  toEmail: {
    emailValidator: helpers.withMessage(
      'Email address is not valid',
      emailValidator
    ),
    required: helpers.withMessage(
      'Email address field cannot be empty',
      required
    ),
  },
  giftingMessage: {
    required: helpers.withMessage(
      'Message field cannot be empty',
      required
    ),
  },
};

const v$ = useVuelidate(rules, state);
const modules = [Pagination];
let isMobileSwiper = ref(false);
const mediaFigure = ref(null);
const swiperr = ref(null);
const route = useRoute();
const { money } = useUtils();
const { currency } = useCurrency();
const descriptionArray = ref([]);
const router = useRouter();
const tabsArray = ref([]);
const tabsPhysicalArray = ref([]);
const relatedProductsArray = ref([]);
const relatedProductsTempArray = ref([]);
const isPhysical = ref(true);
const byAmount = ref(true);
// const giftingMessage = ref('');
const checkoutIframe = ref(null);
const giftcardRef = ref(null)
const leftSideRef = ref(null)
const rightSideRef = ref(null)
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('gift-card', {
  version: version
});
const component = resolveComponent(story.value.content.component);
const emit = defineEmits(['close-modal']);
const giftCardTemplate = ref('')
const query = `
  query productDetails @inContext(country: ${currency.value?currency.value:'US'}){
    productByHandle(handle:"gift-card"){
      description
      descriptionHtml
      handle
      title
      vendor
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
const { addToCart } = useCart();
const quantity = ref(1);
try {
  product = productData.data.productByHandle;

} catch (err) {
  console.log(err);
  navigateTo('/404');
}
const options = product.options;
const selectedVariant = ref(firstAvailableVariant(product));
const selectedService = ref("");
const selectedVariantId = computed(() => {
  return selectedVariant.id;
});
const {
  invoiceID,
  searchGuest,
  createGuest,
  createInvoiceForGiftcard,
  collectInvoicePaymentByUnsavedCreditCard,
  closeAnInvoice,
  getAllServicesOfCenter,
  createGiftCardTemplateWithServices,
  CreateInvoiceUsingGiftcardTemplate
} = useZenotiAPIs();
const centerID = ref(0)
// const toUser = ref('')
// const fromUser = ref('')
// const toEmail = ref('')
const deliveryDate = ref('')
let price = 50;
const checkoutUrl = ref('')
const ZenotiStep = ref(0)
const ZenotiRunning = ref(0)
const ZenotiStatusText = ref('')
const centerData = [
  {
    name: "King West",
    id: "402391b9-0b4a-4da1-bd94-f923b152c50b",
  },
  {
    name: "Yorkville",
    id: "4913e896-8f49-4668-9e1c-d478146d2289",
  },
];
const servicesOfCenter = ref([]);
// tabsPhysicalArray.value = story.value.content.physical_gift_accordion;
tabsArray.value = story.value.content.digital_gift_accordion;
async function stopZenoti() {
  console.log('ZenotiStep 0', ZenotiStep)
  ZenotiStep.value = 0
  ZenotiRunning.value = 0
  emit('close-modal')
  if (invoiceID.value) {
    await closeAnInvoice(invoiceID.value,
    )
    invoiceID.value = null
  }
  
}
const onSwiper = (swiper) => {
  console.log(swiper);
  swiperr.value = swiper
  // selectedVariantFeaturedImage(selectedVariant.value)
};

const checkIfMobile = (swiper) => {
  if (window.innerWidth < 1024) {
    isMobileSwiper.value = true;
  } else {
    isMobileSwiper.value = false;
  }
};

onMounted(async () => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  // selectedVariantFeaturedImage(selectedVariant.value)
  const getServicesResp = await getAllServicesOfCenter(
    centerData[centerID.value].id
  )
  console.log('getServicesResp', getServicesResp)
  servicesOfCenter.value = getServicesResp.data.services
});

watch(centerID, async(newCenterID, oldcenterID) => {
  const getServicesResp = await getAllServicesOfCenter(
    centerData[newCenterID].id
  )
  console.log('getServicesResp', getServicesResp)
  servicesOfCenter.value = getServicesResp.data.services
})



function firstAvailableVariant(product) {
  product.variants.edges.forEach((variant) => {
    if (variant.node.availableForSale) {
      return variant.node;
    }
  });
  return product.variants.edges[0].node;
}


function updateSelectedVariant(option) {
  console.log(option)
  if (option.name = "Size") {
    price = option.value.slice(1)
  }
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
}

const addToCartIsLocked = ref(false);

async function handleAddToCartForm() {
  console.log('handleAddToCartForm')
  if (addToCartIsLocked.value === true) return;
  if (!selectedVariant.value.availableForSale) return;
  const customAttributes = []
  if (state.giftingMessage.trim()) {
    customAttributes.push({key: 'message', value: state.giftingMessage.trim()})
  }
  addToCartIsLocked.value = true;
  await addToCart([
    { quantity: quantity.value, merchandiseId: selectedVariant.value.id, attributes: customAttributes },
  ]);
  addToCartIsLocked.value = false;
}
const config = useRuntimeConfig();
async function handleCheckoutZenotiGift() {
  const valid = await v$.value.$validate();
  if (!valid) return;
  ZenotiStep.value = 1
  ZenotiRunning.value = true
  ZenotiStatusText.value = "1. Searching/Creating a Guest..."
  console.log('handleCheckoutZenotiGift centerID', centerID)
  const searchGuestResp = await searchGuest(
    centerData[centerID.value].id,
    state.toUser,
    state.toEmail
  )
  console.log('searchGuestResp', searchGuestResp)
  let guestData
  if (searchGuestResp.data && searchGuestResp?.data?.guests?.length > 0) {
    guestData = searchGuestResp.data.guests[0]
  } else {
    ZenotiStatusText.value = "Creating a Guest..."
    const guestResp = await createGuest(
      centerData[centerID.value].id,
      state.toUser,
      state.toEmail
    )
    guestData = guestResp.data
    console.log('guestResp', guestResp)
  }
  
  if (!guestData || !guestData.id) {
    ZenotiStatusText.value = "Failed while creating a Guest."
    // ZenotiRunning.value = 0
    return
  }
  setTimeout(async()=>{
    if (!ZenotiStep.value) {
      return
    }
    ZenotiStep.value = 2
    const guest_id = guestData.id
    let invoiceResp = ""
    if (!byAmount.value) {
      ZenotiStatusText.value = "2. Create a gift card template with services..."
      const createGiftCardResp = await createGiftCardTemplateWithServices(
        centerData[centerID.value].id,
        selectedService.value
      )
      console.log('createGiftCardResp', createGiftCardResp)
      if (!createGiftCardResp || !createGiftCardResp.data) {
        ZenotiStatusText.value = "Failed while Creating a gift card Template with services."
        return
      }
      
      //ZenotiStatusText.value = "2. Create a gift card sale invoice after using a gift card template..."
      const giftTemplateID = createGiftCardResp.data.id
      invoiceResp = await CreateInvoiceUsingGiftcardTemplate(
        centerData[centerID.value].id,
        guest_id,
        giftTemplateID,
        state.giftingMessage,
        state.toUser,
        state.toEmail,
      )
      if (!invoiceResp || !invoiceResp.data) {
        ZenotiStatusText.value = "Failed while Creating an invoice for the sale of a gift card."
        // ZenotiRunning.value = 0
        return
      }
    } else {
      ZenotiStatusText.value = "2. Creating an invoice for the sale of a gift card..."
      invoiceResp = await createInvoiceForGiftcard(
        centerData[centerID.value].id,
        guest_id,
        price,
        1,
        state.giftingMessage
      )
      if (!invoiceResp || !invoiceResp.data) {
        ZenotiStatusText.value = "Failed while Creating an invoice for the sale of a gift card."
        // ZenotiRunning.value = 0
        return
      }
    }
    
    setTimeout(async()=>{
      if (!ZenotiStep.value) {
        return
      }
      ZenotiStep.value = 3
      ZenotiStatusText.value = "3. Collect invoice payment..."
      console.log('invoiceResp', invoiceResp)
      const invoice_id = invoiceResp.data.invoice_id
      const checkoutResp = await collectInvoicePaymentByUnsavedCreditCard(
        invoice_id,
        centerData[centerID.value].id,
        config.public.websiteHost + ( config.public.websiteHost.slice(-1) === '/' ? '' : '/') +'giftcard-thankyou?invoice_id=' + invoice_id
      )
      if (!checkoutResp || !checkoutResp.data) {
        ZenotiStatusText.value = "Failed while collecting invoice payment."
        // ZenotiRunning.value = 0
        await closeAnInvoice(invoiceID.value,
        )
        invoiceID.value = null
        return
      }
      console.log("checkoutResp", checkoutResp)
      checkoutUrl.value = checkoutResp.data.hosted_payment_uri
      if (!ZenotiStep.value) {
        return
      }
      invoiceID.value = invoice_id
      ZenotiStep.value = 4
      ZenotiRunning.value = 0
      ZenotiStatusText.value = "checkout"
      // scrollToCheckout() 
      console.log('checkoutIframe.value', checkoutIframe.value, checkoutIframe.value.offsetTop)
    })
  })
  
  
}
const isTablet = ref(false);
function isTabletFunction() {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (width < 1024) {
    isTablet.value = true;
  } else {
    isTablet.value = false;
  }
  return isTablet.value
}
function desktopScrollOffset(){
  const diffHeight = leftSideRef.value.offsetHeight - rightSideRef.value.offsetHeight 
  console.log('window.innerHeight', window.innerHeight, 
  'giftcardRef.offsetTop', giftcardRef.value.offsetTop, 
  'diffHeight', diffHeight, 
  'checkoutIframe.value.offsetTop', checkoutIframe.value.offsetTop, 
  'checkoutIframe.value.scrollTop', checkoutIframe.value.scrollTop, 
  'checkoutIframe.value.scrollOffset', checkoutIframe.value.scrollOffset, 
  'checkoutIframe.value.clientHeight', checkoutIframe.value.clientHeight)
  if (diffHeight > 0) {
    
    return  giftcardRef.value.offsetTop + diffHeight + checkoutIframe.value.offsetTop
  } else {
    return  giftcardRef.value.offsetTop + checkoutIframe.value.offsetTop
  }
}
function scrollToCheckout() {
  console.log('checkoutIframe.value', checkoutIframe.value)
  console.log('desktopScrollOffset()', desktopScrollOffset())
  setTimeout(() => {
    console.log('desktopScrollOffset()', desktopScrollOffset())
    scrollTo({
      behavior: "smooth",
      top: isTabletFunction() ? checkoutIframe.value.offsetTop - 165
        : desktopScrollOffset()
    });
  }, 300);
}
function handleScroll(event) {
  //console.log('window.scrollY', window.scrollY)
}
onMounted(()=>{
  window.addEventListener('scroll', handleScroll);
})
// const obj = {};
// obj.title = "DETAILS";
// obj.description = "-E-gift cards can be used to wards any product  -Enter the code provided via email at the payment step of checkout.";
// tabsArray.value.push(obj);
const objPhysical = {};
objPhysical.title = "DETAILS";
objPhysical.description = product.descriptionHtml;
tabsPhysicalArray.value.push(objPhysical)
</script>
<style lang="scss" scoped>
.btn-price {
  display: flex;
  justify-content: center;
  align-items: center;
  width:80px;
}
textarea,input {
  text-transform: unset;
  font-size: 1rem;
  @screen md {
    font-size: toRem(12);
  }
  &::placeholder {
    text-transform: uppercase;
    color: inherit;
    font-size: inherit;
  }
}
form.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>

<style lang="scss">
.gift-card {
  .lds-spinner {
    width: 4rem;
    height: 4rem;
    div {
      transform-origin: 2rem 2rem;
      &::after {
        height: 0.75rem;
        width: 0.25rem;
        left: toRem(30);
        top: toRem(6);
      }
    }
  }
  &__input-field {
    position: relative;
    .errors {
      bottom: 100%;
      font-size: .75rem;
      position: absolute;
    }
  }
}
</style>
