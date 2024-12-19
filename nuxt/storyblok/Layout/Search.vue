<template>
  <div v-if="blok" class="relative py-10">
    <!-- <label
      for="search"
      class="bg-white flex justify-center px-3 py-[0.625rem]"
    >
      <input
        class="default block"
        id="search"
        type="text"
        placeholder="Search"
        v-model="searchInput"
        @input="onInputChange"
        @blur="onInputBlur"
      />
      <nuxt-link
        :to="`/search?query=${searchInput}`"
        class="inline-block button--primary"
      >
        <IconsSearch />
        <span class="sr-only">Search {{ searchInput }}</span>
      </nuxt-link>
    </label> -->

    <!-- Suggestions list -->
    <div class="relative uppercase" v-if="searchInput && suggestions.stories?.length > 0 || suggestions.products?.length > 0">
      <div
        class="mt-1"
      >
      <header class="mb-4 text-center uppercase slug-xs">
        <h2>Products</h2>
      </header>
      <section class="mb-4">
        <nuxt-link
          v-for="suggestion in suggestions.products"
          :key="suggestion.node.id"
          :to="`/product/${suggestion.node.handle}`"
          class="
          items-center 
          search-item
          flex truncate text-gray-700 hover:text-main hover:bg-gray-100"
        >
          <img
            :src="suggestion.node.featuredImage?.url"
            width="40"
            class="mr-4"
            :alt="suggestion.node.title"
            loading="lazy"/>
          <div class="search-item__text">{{ suggestion.node.title }}</div>
        </nuxt-link>
      </section>
      <section> 
        <header class="mb-4 text-center uppercase slug-xs">
          <h2>Pages</h2>
        </header>         
        <nuxt-link
          v-for="suggestion in suggestions.stories"
          :key="suggestion.id"
          :to="`/${suggestion.full_slug}`"
          class="
            search-item
            block truncate text-gray-700 hover:text-main hover:bg-gray-100"
          >
          <div class="search-item__text">{{ suggestion.name }}</div>
          </nuxt-link>
        </section>
      </div>
    </div>
    <component
      v-for="localBlok in blok.body"
      :key="localBlok._uid"
      :is="localBlok.component"
      :blok="localBlok"
    />
  </div>
</template>

<script setup>
const { blok } = defineProps({
  blok: {
    type: Object,
    required: true,
  },
});

const storyblokApi = useStoryblokApi();
const router = useRouter();
const route = useRoute();
const version = route.query._storyblok || route.isDev ? 'draft' : 'published';
const searchQuery = ref(route.query.query ? route.query.query : '')
const searchInput = ref('')
const suggestions = ref([])
console.log(route)

onMounted(async () => {
  searchInput.value = searchQuery.value
  if (!searchQuery.value) {
    return;
  }
  suggestions.value = await fetchSuggestions(searchInput.value)
  console.log(suggestions.value)
})

const fetchSuggestions = async (searchInput) => {
  const { data } = await storyblokApi.get('cdn/stories/', {
      version: version,
      excluding_slugs: 'global-elements/*',
      search_term: searchInput
    }
  )

  const query = `{
      products(query:"title:*${searchInput}* OR tag:*${searchInput}*" first:250 ) {
        edges {
          node {
            id
            handle
            title
            description
            featuredImage {
							url
						}            
          }
        }
      }
    }`

  const products = await useShopify({ query })
  console.log(products)

  return {
    stories : data.stories,
    products : products?.data?.products?.edges
  }
}

watch(route, async (newRoute, previous) => {
  searchInput.value = newRoute.query.query
  suggestions.value = await fetchSuggestions(searchInput.value)
})

const onInputChange = async () => {
  if (!searchQuery.value) {
    return;
  }
  suggestions.value = await fetchSuggestions(searchInput.value)
}

</script>

<style lang="scss" scoped>
.search-item {
  border-top: solid 1px gray;
  padding: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &__text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &:last-of-type {
    border-bottom: solid 1px gray;
  }
}
</style>