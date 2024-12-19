<template>
  <div
    class="
      product-search
      py-6
      px-6
      flex justify-between
      bg-mp-off-white
      pointer-events-none
    "
  >
    <input
      placeholder="SEARCH BY DESIGNER OR ITEM TYPE"
      class="
        w-11/12
        text-sm
        border-b
        border-black
        outline-none
        bg-mp-off-white
        pointer-events-auto
      "
      v-model="searchString"
    />
    <button
      class="close-button pointer-events-auto"
      @click="toggleSearch"
    >
      <IconsCloseX />
    </button>
  </div>
</template>
<script setup>
import {watch} from "vue"
const { value } = defineProps({
  value: {
    default: '',
  },

});
const {searchProducts} = useProducts();
const searchString = ref('')
const searched_products = ref(null)
const emit = defineEmits(['onSearch', 'toggleSearch']);
searchString.value = value
watch(searchString, async (newSearchString, oldVal) => {
  if (!newSearchString) {
    searched_products.value = null
  } else {
    searched_products.value = await searchProducts(newSearchString)
  }
  emit('onSearch', searched_products.value, newSearchString);
})
function toggleSearch() {
  emit('toggleSearch');
}
</script>
<style lang="scss" scoped>
button.close-button {
  @apply w-[34px] h-[34px] p-2 border border-black;
  border-radius: 100%;
}
</style>