<template>
<div>
  <div
    v-if="onlyPackaging"
    class="flex justify-center items-center h-20 text-center"
  >
    {{ giftingPackaging
      ? '$' + price_amount(giftingPackagingInfo) + price_currency(giftingPackagingInfo) 
      : ''}}
  </div>
  <div
    v-else
    class="flex justify-center items-center text-center"
     :class="[giftingPackaging && giftingPackagingInfo ? 'my-8 md:mt-[60px] md:mb-4' : '']"
  >
    {{ giftingPackaging && giftingPackagingInfo
      ? total_price
      : giftingProducts_selected_price
    }}
  </div>
  </div>
</template>
<script setup>
import {computed} from "vue"
const {giftingPackaging, giftingPackingList, giftingProductList} = useGiftCart();
const {getProductInfo} = useProducts();
const giftingPackagingInfo = computed(()=> {
  const selectedPack =  giftingPackingList.value.filter((product)=> {
    return product.node.id == giftingPackaging.value
  })
  return selectedPack.length > 0 ? selectedPack[0].node : null
})
const total_price = ref('')
const giftingProducts_selected_price = ref('')

async function reload_productList(ProductList) {
  const selected_products = []
  for (const productID of ProductList) {
    selected_products.push(await getProductInfo(productID))
  }
  if (giftingPackaging.value) {
    total_price.value = ('$' + (price_amount(giftingPackagingInfo.value) + price_amount_of_all(selected_products)) + price_currency(giftingPackagingInfo.value)) 
  }
  giftingProducts_selected_price.value = (selected_products && selected_products.length > 0 ? '$' + price_amount_of_all(selected_products) + price_currency(selected_products[0]) : '')
}
await reload_productList(giftingProductList.value)
watch(giftingProductList, async (newGiftingProductList) => {
  await reload_productList(newGiftingProductList)
})
watch(giftingPackaging, async(newGiftingPackaging) => {
  console.log('giftingPackaging', giftingPackaging)
  await reload_productList(giftingProductList.value)
})
function price_currency(product) {
  let currency = ''
  switch( product?.variants?.edges[0]?.node?.priceV2.currencyCode) {
    case "USD":
      currency = ""
      break;
    case 'CAD':
      currency = " CAD";
      break;
    default:
      currency = ""
  }
  return currency
}
function price_amount(product) {
  return parseFloat(product?.variants?.edges[0]?.node?.priceV2.amount)
}
function price_amount_of_all(products) {
  return products.reduce((accumulator , product) => {
    return accumulator + price_amount(product);
  }, 0)
}

const {
  onlyPackaging
} = defineProps({ 
  onlyPackaging: {
    type: Boolean,
    default: false
  }
});


</script>
<style lang="scss" scoped>

</style>