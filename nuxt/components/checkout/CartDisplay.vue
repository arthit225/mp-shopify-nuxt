<template>
  <div class="w-full">
    <div v-if="cart" class="border bg-gray-50 p-4 rounded-md max-w-[500px] mx-auto">
      <h1
        class="text-sm heading-xs leading-[1.50] futura-std-regular px-8 mb-8 border-b py-4"
      >
        Order summary
      </h1>
      <div class="px-8 border-b pb-4">
        <ul>
          <li v-for="lineItem in lineItems" :key="lineItem.id" class="flex mb-2">
            <div class="w-16 h-16 rounded-lg overflow-hidden mr-4 border">
              <img
                class="w-full h-full object-cover"
                :src="lineItem.merchandise.product.featuredImage.transformedSrc"
                :alt="lineItem.merchandise.product.title"
              />
            </div>
            <div class="mr-4 flex-1">
              <h1 class="text-extra-small">{{ lineItem.merchandise.product.title }}</h1>
            </div>
            <div>
              <h1 class="text-extra-small">{{ money(lineItem.merchandise.priceV2) }}</h1>
            </div>
          </li>
        </ul>
      </div>
      <div class="text-small pt-4">
        <div class="flex justify-between px-8">
          <span>Subtotal:</span>
          <span>{{ money(cart.estimatedCost.subtotalAmount) }}</span>
        </div>
        <div class="flex justify-between px-8">
          <span>Shipping:</span> <span>---</span>
        </div>
        <div class="flex justify-between px-8 border-b pb-4">
          <span>Taxes:</span> <span>---</span>
        </div>
        <div class="flex justify-between px-8 pt-4 pb-6">
          <span>Total:</span>
          <span>{{ money(cart.estimatedCost.totalAmount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { money } = useUtils();

const { cart, lineItems } = useCart();

// onMounted(() => {
//   console.log(lineItems);
// });
</script>
