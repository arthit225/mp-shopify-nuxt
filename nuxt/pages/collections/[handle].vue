<template>
  <section class="">
    <LayoutTheMetaShopify v-if="collectionData" :shopifyObject="collectionData" type="collection" />
    <!-- <product-choose-currency-modal
      v-if="!currency"
      :show-modal="!currency"
    /> -->
    <div class="flex flex-col gap-y-4 mx-auto text-center relative">
      <img
        :src="collectionData.image.url"
        class="block w-full h-auto max-h-[400px] object-cover"
      />
      <div
        class="absolute left-1/2 top-1/2 bg-white p-4 transform -translate-x-1/2 -translate-y-1/2 rounded"
      >
        <h1 class="text-xl">{{ collectionData.title }}</h1>
        <p class="text-sm">{{ collectionData.description }}</p>
        <p>handle: {{ collectionData.handle }}</p>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div v-for="product in productsArray" :key="product.id">
        <nuxt-link :to="'/product/' + product.handle">
          <div class="p-4 bg-slate-100 rounded border">
            <img
              :width="product.featuredImage.width"
              :height="product.featuredImage.height"
              :src="product.featuredImage.src"
              :alt="product.featuredImage.altText"
            />
            <h1>{{ product.title }}</h1>
            <span class="block">{{
              money(product.priceRange.minVariantPrice)
            }}</span>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="text-center py-4">
      <button
        v-if="pagination.hasNextPage"
        @click="loadMoreProducts"
        class="px-2 py-1"
      >
        Load More
      </button>
    </div>
  </section>
</template>

<script setup>
const { money } = useUtils();
const route = useRoute();
const { currency } = useCurrency();

const query = `
  query getCollection @inContext(country: ${currency.value}){
    collectionByHandle(handle:"${route.params.handle}") {
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
          cursor
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
          }
        }
        pageInfo {
          hasPreviousPage
          startCursor
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const collectionObject = await useShopify({ query });

const collectionData = ref({});
const productsArray = ref([]);
const pagination = reactive({
  cursor: null,
  hasNextPage: false,
});

try {
  const collectionInfo = collectionObject.data.collectionByHandle;
  const products = collectionObject.data.collectionByHandle.products;
  const transformedProductsArray = [];
  products.edges.forEach((edge) => {
    transformedProductsArray.push(edge.node);
  });

  const productEdges = collectionObject.data.collectionByHandle.products.edges;
  const pageInfo = collectionObject.data.collectionByHandle.products.pageInfo;

  pagination.cursor = productEdges[productEdges.length - 1].cursor;
  pagination.hasNextPage = pageInfo.hasNextPage;

  collectionData.value = collectionInfo;
  productsArray.value = transformedProductsArray;
} catch (err) {
  console.log(err);
  product.value = {
    title: 'null',
    description: 'null',
    media: [],
    handle: 'null',
  };
  navigateTo('/404');
}

async function loadMoreProducts() {
  if (!pagination.hasNextPage) return;

  const query = `
    query getCollection @inContext(country: ${currency.value}){
      collectionByHandle(handle:"${route.params.handle}") {
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
        products(first: 32, after: "${pagination.cursor}") {
          edges {
            cursor
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
            }
          }
          pageInfo {
            hasPreviousPage
            startCursor
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  const responseData = await useShopify({ query });

  const products = responseData.data.collectionByHandle.products;
  const transformedProductsArray = [];
  products.edges.forEach((edge) => {
    transformedProductsArray.push(edge.node);
  });

  const productEdges = responseData.data.collectionByHandle.products.edges;
  const pageInfo = responseData.data.collectionByHandle.products.pageInfo;

  pagination.cursor = productEdges[productEdges.length - 1].cursor;
  pagination.hasNextPage = pageInfo.hasNextPage;
  productsArray.value.push(...transformedProductsArray);
}
</script>
