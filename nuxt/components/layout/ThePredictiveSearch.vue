<template>
  <div class="relative">
    <label
      for="search-sidebar"
      class="bg-white flex justify-starrt items-center px-3 py-[0.625rem]"
    >
      <nuxt-link
        :key="searchInput"
        :to="`/search?query=${searchInput}`"
        class="inline-block w-[1.125rem] h-4 mr-[0.625rem]"
      >
        <IconsSearch />
        <span class="sr-only">Search {{ searchInput }}</span>
      </nuxt-link>
      <input
        class="outline-none block w-full"
        id="search-sidebar"
        type="text"
        placeholder="Search"
        v-model="searchInput"
        @input="onInputChange"
        @blur="onInputBlur"
      />
      <span class="sr-only">Search</span>
    </label>

    <!-- Suggestions list -->
    <div class="relative" v-if="searchInput && suggestions.stories?.length > 0 || suggestions.products?.length > 0">
      <div
        class="absolute z-30 bg-white top-0 inset-x-0 rounded shadow-lg mt-1"
      >
        <nuxt-link
          v-for="suggestion in suggestions.products"
          :key="suggestion.node.id"
          :to="`/product/${suggestion.node.handle}`"
          class="block truncate text-gray-700 hover:text-main hover:bg-gray-100 px-4 py-2"
        >
          {{ suggestion.node.title }}
        </nuxt-link>
        <nuxt-link
          v-for="suggestion in suggestions.stories"
          :key="suggestion.id"
          :to="`/${suggestion.full_slug}`"
          class="block truncate text-gray-700 hover:text-main hover:bg-gray-100 px-4 py-2"
        >
          {{ suggestion.name }}
        </nuxt-link>
        <nuxt-link
          :key="searchInput"
          :to="`/search?query=${searchInput}`"
          class="block text-main bg-gray-100 px-4 py-2"
        >
          <span class="slug-xs">SEE ALL SEARCH RESULTS ></span>
        </nuxt-link>
      </div> 
    </div>
  </div>
</template>

<script setup>
  const { search, query } = defineProps({
    search: {
      type: Function,
      required: true
    },
    query: String
  })

  const searchInput = ref('')
  const suggestions = ref([])

  onMounted(async () => {
    query ? searchInput.value = query : ''
    suggestions.value = await search(searchInput.value)
  })
  
  const onInputChange = async () => {
    suggestions.value = await search(searchInput.value)
    console.log(suggestions.value)
  }
  </script>