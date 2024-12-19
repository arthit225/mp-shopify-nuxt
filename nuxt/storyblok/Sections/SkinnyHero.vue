<template>
<div
  class="skinny-hero-section"
  v-editable="blok"
  :data-id="blok._uid"
  :data-component="blok.component"
  :id="blok._uid"
>
  <!-- <product-choose-currency-modal
    :show-modal="!currency"
  /> -->
  <header
    v-if="blok.subject"
    class="flex gap-4 px-4 lg:px-8 leading-normal tracking-[2px] mb-7 md-down:mb-3"
  >
    <h2 class="futura-std-medium heading-xs uppercase">
      {{ relatedDoseArticle }}
    </h2>
  </header>
  <div
    v-if="blok && blok.reserve"
    v-editable="blok"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      main-page-hero
      flex
      justify-start
      lg:items-center
      flex-col
      lg:flex-row
      min-h-[200px]
    "
  >
    <figure class="w-full lg:w-2/3 realtive lg:pr-0" v-if="!route.path.includes('/the-dose/')">
      <lazyload-img
      v-if="blok && blok.image"
      :widths="[1900, 1300, 780, 640, 320]"
      :breakpoints="[1900, 1300, 780, 641, 320]"
      :key="blok.image.filename"
      :src="blok.image.filename"
      pictureClasses="flex justify-start"
      imgClasses="w-full block lazyload"
      :defaultRatio="true"
      :absolute="true"
    />
    </figure>
    <div class="mt-5 ml-6 mr-6 lg:absolute lg:right-[9%] z-[1] lg:max-w-[500px] whitespace-pre-line"
      :class="{
        'lg:max-w-full lg:relative lg:right-0 w-full' : route.path.includes('/the-dose/')
      }">
      <div
        v-if="blok.category"
        class="
          whitespace-pre-line
          text-xs
          leading-[1.375rem]
          lg:leading-[1.688rem]
          mb-8
          lg:text-left
        "
        :class="{
          '!text-center lg:!text-center' : route.path.includes('/the-dose/')
        }"
      >
        <p class="mid-underline">
          {{ blok.category }}
        </p>
      </div>
      <h2
        v-if="blok.title"
        class="
         heading-m leading-none mb-3
         text-right lg:text-left
        "
        :class="{
          '!text-center lg:!text-center' : route.path.includes('/the-dose/')
        }"
      >
        {{ blok.title }}
      </h2>
      <p
        v-if="blok.description"
        class="
          whitespace-pre-line
          text-medium
          leading-[1.375rem]
          lg:leading-[1.688rem]
          max-w-[309px]
          mt-8
          ml-auto lg:ml-20
          text-right lg:text-left
        "
        :class="{
          '!text-center !mx-auto' : route.path.includes('/the-dose/')
        }"
      >
        {{ blok.description }}
      </p>
      <div class="flex justify-end lg:justify-start ml-20 mt-8 gap-8"
        :class="{
          '!justify-center !mx-auto' : route.path.includes('/the-dose/')
        }">
        <nuxt-link
          v-for="link in blok.links"
          :key="link._uid"
          :to="linkTo(link)"
          :target="link.link.url ?'_blank': '_self'"
          class="
            whitespace-pre-line
            text-xs
            leading-[1.375rem]
            lg:leading-[1.688rem]
            max-w-[260px]
            mb-8
            underline
          "
        >
         {{ link.text }}
        </nuxt-link>
    </div>
    </div>
  </div>
  <div
    v-else-if="blok && !blok.reserve"
    v-editable="blok"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      main-page-hero
      flex
      justify-end
      lg:items-center
      flex-col
      lg:flex-row
      min-h-[200px]
    "
  >
    <figure class="w-full lg:w-2/3 realtive">
      <lazyload-img
      v-if="blok && blok.image"
      :widths="[1900, 1300, 780, 640, 320]"
      :breakpoints="[1900, 1300, 780, 641, 320]"
      :key="blok.image.filename"
      :src="blok.image.filename"
      pictureClasses="flex justify-end"
      imgClasses="w-full block lazyload"
      :defaultRatio="true"
      :absolute="true"
    />
    </figure>
    <div class="mt-5 ml-6 mr-6 lg:absolute left-[14%] z-[1]">
      <div
        v-if="blok.subtitle"
        class="
          whitespace-pre-line
          text-xs
          leading-[1.375rem]
          lg:leading-[1.688rem]
          mb-8
          text-right
        "
      >
        <p class="mid-underline">
          {{ blok.subtitle }}
        </p>
      </div>
      <h2
        v-if="blok.title"
        class="
          heading-m leading-none mb-3 max-w-[500px] whitespace-pre-line text-right
        "
      >
        {{ blok.title }}
      </h2>
      <p
        v-if="blok.description"
        class="
          whitespace-pre-line
          text-medium
          leading-[1.375rem]
          lg:leading-[1.688rem]
          max-w-[309px]
          mt-6
          ml-14
          text-right
        "
      >
        {{ blok.description }}
      </p>
      <div class="mt-8 text-right gap-8 ">
        <nuxt-link
          v-for="link in blok.links"
          :key="link._uid"
          :to="linkTo(link)"
          :target="link.link.url ?'_blank': '_self'"
          class="
            whitespace-pre-line
            text-xs
            leading-[1.375rem]
            lg:leading-[1.688rem]
            max-w-[260px]
            mb-8
            underline
            mr-20
          "
        >
          {{ link.text }}
        </nuxt-link>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
const { currency } = useCurrency();
const route = useRoute();
const { blok } = defineProps({ blok: Object });

function linkTo(link) {
  let to = link.link.url ? link.link.url :(link.link.cached_url ? '/'+link.link.cached_url : '/') + (link.link.anchor ? '#' + link.link.anchor : '')
  return link.is_shop_button ? to + '?shop=true'  : to
}
const relatedDoseArticle = ref('')

const query = `
  query productDetails @inContext(country: ${ currency.value ? currency.value:'US'}){
    productByHandle(handle:"${route.params.handle}"){
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
} catch (err) {
  console.log(err);
  navigateTo('/404');
}

function productMetafields() {
  product?.metafields.forEach((field) => {
    if (field && field.key == "related_dose_article") {
      relatedDoseArticle.value = field.value;
    }
  });
}

productMetafields();

</script>

<style lang="scss" scoped>
</style>
