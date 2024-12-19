<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="
      pt-10
      four-up
      featured-products
      tracking-[2px]
      futura-std-medium
      pb-[6.25rem]
      md-down:pb-16"
  >

    <header
      class="
      flex
      flex-wrap
      items-center
      gap-4
      px-4
      md:px-8
      leading-normal
      tracking-[2px]
      mb-7
      md-down:mb-0
      "
    >
      <h2 
        v-if="blok.title"
        class="futura-std-medium heading-xs uppercase">
        {{ blok.title }}
      </h2>
      
      <SnippetsSelectDropdown
        v-if="!blok.hide_filter"
        class="w-full sm:w-[200px]"
        v-model="FilterSelect"
        :options="[
          'Featured', 'Best Selling', 'Price High to Low', 'Price Low to High'
        ]"
      />

      <SnippetsSelectDropdown
        v-if="!blok.hide_filter && FilterVendor"
        class="w-full sm:w-[200px]"
        v-model="FilterVendor"
        :options="allVendors"
      />
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
  
   <div
    v-if="sortedFullProducts.length > 0"
    class="
      grid
      grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      sm:mt-10
      gap-y-10
      md:gap-x-6
      gap-x-4
      grid-layout
    ">
      <div class="flex-1 relative" v-for="product in sortedFullProducts" :key="product?.id">
        <div class="h-full flex flex-col">
          <div
            class="relative w-full mx-auto four-up__item text-center bg-mp-off-white flex flex-col md-down:pb-4 pb-5 mb-9 flex-1"
          >
            <nuxt-link
              :to="`/product/${product?.handle}`"
              class="block mb-4 md-down:mb-2.5"
            >
              <lazyload-img
                v-if="product?.featuredImage?.src"
                :widths="[400, 350, 300, 500]"
                :breakpoints="[1200, 1024, 641, 640]"
                :key="product?.featuredImage?.src"
                :src="product?.featuredImage?.src"
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
              {{ product?.vendor }}
            </p>
            <div class="flex flex-col justify-between flex-1 px-3">
              <nuxt-link
                :to="`/product/${product?.handle}`"
                class="block mb-2 mx-auto max-w-xs xl:max-w-[15rem]">
                <div
                  v-if="product?.title"
                  class="md-down:text-sm md-down:leading-[1.25rem] uppercase max-h- max-h-[40px] md:max-h-[47px] overflow-hidden"
                >
                  {{ product?.title }}
                </div>
              </nuxt-link>
              <p class="text-xs">
                {{ money(product?.priceRange.minVariantPrice) }}
              </p>
            </div>
          </div>

          <div class="item-action mt-auto">
            <div v-if="product?.variants.edges.length > 1">
              <nuxt-link
                :to="`/product/${product?.handle}`"
                class="button--primary w-full uppercase block"
              >
                Shop Now
              </nuxt-link>
            </div>
            <div v-else>
              <button
                v-if="is_sold_out(product?.variants.edges[0].node)"
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
                  handleAddToCartForm(product?.variants.edges[0].node)
                "
                class="button--primary w-full uppercase"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
   </div>
  
  <div
    v-else
    class="
      grid
      grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      sm:mt-10
      gap-y-10
      md:gap-x-6
      gap-x-4
      grid-layout
    ">
    <div
      v-for="index in 8"
      :key="index"
      class="plp-item-placeholder">
      
    </div>
  </div>
  
   <div  
      v-if="!blok.hide_filter && sortedFullProducts.length > 0"
      class="pagination flex flex-col items-center justify-center mt-4">
      <p class="my-4 text-xs uppercase">Showing {{sortedFullProducts.length}} products </p>
      <button
        class="button--primary uppercase block w-[200px]"
        v-if="hasNextPage"
        @click="getCollections(true)"
      >
        Load More
      </button>
  </div>
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
  
const FilterSelect = ref('Featured')
const sortKey = computed(()=>{
  switch (FilterSelect.value) {
    case 'Price High to Low':
    case 'Price Low to High':
      return 'PRICE'
    case 'Best Selling':
      return 'BEST_SELLING'
    case 'By Brand':
      return 'TITLE'
    default:
      return false
  }
})
const reverse = computed(()=>{
  switch (FilterSelect.value) {
    case 'Price High to Low':
      return true
    case 'Price Low to High':
      return false
    case 'Best Selling':
      return false
    default:
      return false
  }
})
const defaultFilterVender = 'ALL BRANDS'
const tags = computed(()=>{
  return FilterSelect.value == 'Featured' ? 'filter_featured' : ''
})
const sortedFullProducts = computed(()=>{
  if (FilterVendor.value && FilterVendor.value !== defaultFilterVender) {
    return state.fullProducts.filter(product=>product.vendor === FilterVendor.value)
  }
  return state.fullProducts
})
let pageCursor=[]
let pages = 1
let hasNextPage = ref(false)
const {sortAndPaginationProductsByCollection} = useProducts()
console.log("blokky", blok);
let collectionIds = [];
let ids = [];

const allVendors = ref([]);
const FilterVendor = ref('')
async function getAllProductsForVendor(ids = collectionIds) {
  const query = `
  query getCollections($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        id
        handle
        title
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              vendor
            }
          }
        }
      }
    }
  }`;
  const variables = {
    ids: ids,
  };

  const collectionResponseData = await useShopify({ query, variables });
  console.log('collectionResponseData', collectionResponseData);
  collectionResponseData.data?.nodes.forEach(coll => {
    coll.products.edges.forEach(product => {
      allVendors.value.push(product.node.vendor)
    });
  }); 
  allVendors.value = [...new Set(allVendors.value)]
  allVendors.value = [defaultFilterVender, ...allVendors.value.sort((a,b)=>a.localeCompare(b))]
  console.log('allVendors', allVendors.value)
  FilterVendor.value = allVendors.value[0]
}
 
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
let individualProducts = []
const showingCounts = ref(0)
async function getCollections( loadMore=false, firstLoad=false) {
  console.log('getCollections')
  if (loadMore) {
    pages = pages + 1
  } else {
    state.fullProducts = [...individualProducts]
    console.log('Not load more state.fullProducts', state.fullProducts, 'individualProducts', individualProducts)
  }
  let hasNext = false
  let index = 0
  for (const collectionId of collectionIds)
  {
    console.log("collectionId", collectionId)
    const per_page = blok.per_page ? blok.per_page : 50
    const productsResponseData = await sortAndPaginationProductsByCollection(
      collectionId,
      FilterVendor.value,
      sortKey.value,
      reverse.value,
      loadMore ? per_page : per_page * pages,
      loadMore ? pageCursor[index] : null,
      tags
    );
    if (productsResponseData) {
      console.log('productsResponseData', productsResponseData)
      pageCursor[index] = productsResponseData.pageInfo.endCursor
      if (productsResponseData.pageInfo.hasNextPage) {
        hasNext = true
      }
      console.log('showingCounts.value', showingCounts.value, 'loadMore', loadMore,  'productsResponseData.edges.length', productsResponseData.edges.length )
      if (firstLoad || loadMore) {
        showingCounts.value += productsResponseData.edges.length
      }

      productsResponseData.edges.forEach(ee => {
        productMetafields(ee.node)
        state.fullProducts.push(ee.node)
      })
      const tempArray = state.fullProducts.map(JSON.stringify);
      state.fullProducts = Array.from(new Set(tempArray)).map(JSON.parse);
    }
    index ++
  }
  console.log('hasNext', hasNext)
  hasNextPage.value = hasNext
}

async function productMetafields(product) {
  product.isSoldOutMessage = false
  product?.metafields?.forEach((field) => {
    if (field && field.key == "show_sold_out_message") {
      product.isSoldOutMessage = field.value == 'true' || field.value == true ? true : false;
    }
  });
}

watch((FilterSelect), async (newFilter, oldFilter)=>{
  await getCollections(false)
})
watch(FilterVendor, async (newFilter, oldFilter)=>{
  await getCollections(false)
  console.log(FilterVendor)
})
onMounted(async ()=>{
  blok.products.items.forEach((i) => {
    if (i.type == 'product') {
      ids.push(i.id)
    } else {
      collectionIds.push(i.id)
      pageCursor.push(null)
    }
  })
  console.log('collectionIds', collectionIds);
  const responseData = await useShopify({ query, variables });
  console.log(responseData);

  if (responseData.data.nodes.length > 0) {
    responseData.data.nodes.forEach((e) => {
      if (e) {
        productMetafields(e)
        individualProducts.push(e)
      }
    });
  }
  showingCounts.value = individualProducts?.length
  await getAllProductsForVendor()
  await getCollections(false, true);
})

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
.plp-item-placeholder {
  background: var(--mp-off-white);
  padding: 150% 0 0 0;
}
.four-up {
  .grid-layout{
      padding: 0 2rem;
      @screen md-down {
        padding: 0 1rem;
      }
  }
  
}
</style>
