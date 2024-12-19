<template>
  <div class="product-filter bg-mp-off-white pb-4">
    <div class="flex justify-between p-4">
      <button
        class="close-button pointer-events-auto"
        @click="toggleFilter"
      >
        <IconsCloseX />
      </button>
      <button
        class="uppercase px-4"
        @click="resetFilter"
      >
        Reset
      </button>
    </div>
    <ul>
      <template
        v-for="filter_item in giftingFilterContent.content.filter_items"
      >
        <gifting-product-filter-accordion-item
          :key="filter_item._uid"
          :title="filter_item.title"
          panelClass="flex flex-wrap gap-9 justify-center md:px-[72px]"
          v-if="filter_item.component === 'gifting-filter-item-tag'"
        >
          <div
            v-for="option in filter_item.options"
            :key="option._uid"
            class="flex gap-2 items-center"
          >
            <input
              v-if="filter_item.tag_name==='color'"
              type="checkbox"
              :id="option.Value"
              class="filter-color-checkbox !w-9 !h-9"
              :value="option.Value"
              :title="option.Value"
              :style="{color: option.Value}"
              v-model="checkedTagsValues[filter_item.tag_name]"
            >
            <input
              v-else
              type="checkbox"
              :id="option.Value"
              class="flex-none"
              :value="option.Value"
              :title="option.Value"
              v-model="checkedTagsValues[filter_item.tag_name]"
            >
            <label
              v-if="filter_item.tag_name==='color'"
              :for="option.Value" class='sr-only'
            >
              {{ option.Value }}
            </label>
            <label
              v-else
              :for="option.Value"
            >
              {{ option.Value }}
            </label>
          </div>
        </gifting-product-filter-accordion-item>
        <gifting-product-filter-accordion-item
          v-else
          :key="filter_item._uid"
          :title="filter_item.title"
        >
          <div
            v-if="filter_item.component === 'gifting-filter-item-collection'"
            class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div
              v-for="(collection) in filter_item.collections"
              :key="collection.handle"
              class="flex gap-8 items-center"
            >
              <input
                type="radio"
                :id="collection.handle"
                class="flex-none checkbox"
                name="checkedCollection"
                :value="collection.handle"
                v-model="checkedCollectionValue"
                :disabled="isTagChecked"
              >
              <label :for="collection.handle">
                {{ collection.title }}
              </label>
            </div>
          </div>
          <div 
            v-else-if="filter_item.component === 'gifting-filter-item-price'"
            class="grid md:flex justify-center gap-8">
            <input
              class="default w-[210px]"
              autocomplete="on"
              placeholder="Min"
              type="number"
              v-model="minPriceValue"
              :disabled="isTagChecked"
            />
            <input
              class="default w-[210px]"
              autocomplete="on"
              placeholder="Max"
              type="number"
              v-model="maxPriceValue"
              :disabled="isTagChecked"
            />
          </div>
        </gifting-product-filter-accordion-item>
      </template>
    </ul>
     <button
        ref="refine"
        @click="refine"
        class="
          button--black
          block
          text-center
          w-[300px]
          uppercase
          mx-auto
          my-20
        "
        :disabled="(!isTagChecked && !checkedCollectionValue.length)?true:false"
      >
        Refine
      </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['onFilter', 'toggleFilter']);
const { checkedCollection, minPrice, maxPrice } = defineProps({
  checkedCollection: {
    default: [],
  },
  minPrice: {
    default: ''
  },
  maxPrice: {
    default: ''
  },
});
const checkedCollectionValue = ref('')
const minPriceValue = ref('')
const maxPriceValue = ref('')
checkedCollectionValue.value = checkedCollection
minPriceValue.value = minPrice
maxPriceValue.value = maxPrice
const {filterProductsByCollection, searchProductsByFilterTags} = useProducts();
const route = useRoute();
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories/global-elements/gifting-filter", {
  version: version,
});
const giftingFilterContent = reactive({ content: data.story.content });
const filtered_products = ref(null)
const checkedTagsValues = ref({})
const FilterTagItems = giftingFilterContent.content.filter_items.filter(
  filter_item=> filter_item.component==='gifting-filter-item-tag'
).map(filter_item => {
  return {
    tag_name: filter_item?.tag_name,
    options: filter_item?.options.map(option=> {
      return {
        Value: option?.Value,
        /*sameValueList: option?.sameValueList.map(
          value => value?.value
        )*/
      }
    })
  }
})
let FilterTagItemsList ={}
FilterTagItems.forEach(FilterTagItem => {
  checkedTagsValues.value[FilterTagItem.tag_name] = []
  FilterTagItemsList[FilterTagItem.tag_name] = {}
  FilterTagItem.options.forEach(option=> {
    FilterTagItemsList[FilterTagItem.tag_name][option.Value] = [option.Value/*, ...option.sameValueList*/]
  })
})


function toggleFilter() {
  emit('toggleFilter');
}
const  isTagChecked = computed(()=> {
  for(var key in checkedTagsValues.value){
    if (checkedTagsValues.value[key].length > 0) {
      return true
    }
  }
  return false
})
function resetFilter() {
  checkedCollectionValue.value = ''
  for(var key in checkedTagsValues.value){
    checkedTagsValues.value[key] = []
  }
  minPriceValue.value = ''
  maxPriceValue.value = ''
  filtered_products.value = null
}
async function  refine() {
  if (isTagChecked) {
    let checkedAllTagValues = {}
    for(var tag in checkedTagsValues.value){
      if (checkedTagsValues.value[tag].length > 0) {
        checkedAllTagValues[tag] = []
        checkedTagsValues.value[tag].map(Value=>FilterTagItemsList[tag][Value]).forEach(values=>checkedAllTagValues[tag].push(...values))
      }
    }
    
    console.log('checkedAllTagValues', checkedAllTagValues)
    filtered_products.value = await searchProductsByFilterTags(checkedAllTagValues)
  } else {
    filtered_products.value = await filterProductsByCollection(checkedCollectionValue.value, minPriceValue.value, maxPriceValue.value )
  }
  console.log('filtered_products.value', filtered_products.value, 'minPrice in Filter',minPriceValue.value, 'maxPrice in Filter', maxPriceValue.value)
  emit('onFilter', filtered_products.value, checkedCollectionValue.value, minPriceValue.value, maxPriceValue.value, checkedTagsValues.value);
  toggleFilter()
}
</script>
<style lang="scss" scoped>
button.close-button {
  @apply w-[34px] h-[34px] p-2 border border-black;
  border-radius: 100%;
}
.product-filter {
  input[type=radio] {
    &[disabled] {
      border-color: gray;
      &:checked:after {
        background: gray;
      }
      cursor: not-allowed;
    }
  }
  input {
    cursor: pointer;
    &[disabled]{
      cursor: not-allowed;
    }
  }
  .filter-color-checkbox {
    background: currentColor !important;
    border-radius: 100%;
    &:checked:after {
      width: 130% !important;
      height: 130% !important;
      border-radius: 100%;
      /* background: white; */
      background: transparent !important;
      border: 2px solid currentColor;
      z-index: 1;
    }
  }
}

</style>

