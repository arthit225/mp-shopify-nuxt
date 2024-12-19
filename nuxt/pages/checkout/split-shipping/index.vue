<template>
  <div>
    <div v-if="lineItems" class="mt-6 px-3">
      <div v-for="lineItem in lineItems" :key="lineItem.id" class="mb-4">
        <div class="flex items-center">
          <img
            :src="lineItem.merchandise.product.featuredImage.transformedSrc"
            :width="150"
            height="auto"
            class="mr-4"
          />
          <div class="text-extra-small flex flex-col">
            <h1 class="text-base">
              {{ lineItem.merchandise.product.title }}
            </h1>
            <ul>
              <li
                v-for="option in lineItem.merchandise.selectedOptions"
                :key="option.name"
                :class="option.name === 'Title' ? 'hidden' : ''"
              >
                {{ option.name }}: {{ option.value }}
              </li>
            </ul>
            <span class="text-base"
              >Quantity:
              <button
                class="text-large default"
                @click="
                  lineItem.quantity === 1
                    ? removeLineItemsWrapper(['' + lineItem.id])
                    : updateLinesItemsWrapper([
                        {
                          id: lineItem.id,
                          quantity: lineItem.quantity - 1,
                        },
                      ])
                "
              >
                -
              </button>
              {{ lineItem.quantity }}
              <button
                @click="
                  updateLinesItemsWrapper([
                    {
                      id: lineItem.id,
                      quantity: lineItem.quantity + 1,
                    },
                  ])
                "
                class="text-large default"
              >
                +
              </button></span
            >
            <span class="text-base"
              >{{ money(lineItem.estimatedCost.totalAmount) }}
              <span
                v-if="
                  parseFloat(lineItem.estimatedCost.totalAmount.amount) !==
                  parseFloat(lineItem.estimatedCost.subtotalAmount.amount)
                "
                class="line-through opacity-60"
                >{{ money(lineItem.estimatedCost.subtotalAmount) }}</span
              ></span
            >
          </div>
          <button @click="removeLineItemsWrapper([`${lineItem.id}`])">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { lineItems, updateLineItems, removeLineItems } = useCart();
const { money } = useUtils();
const cartIsLocked = ref(false);
onMounted(() => {
  console.log(lineItems, 'wtf');
});

async function updateLinesItemsWrapper(lineItemsArray) {
  if (cartIsLocked.value === true) return;
  cartIsLocked.value = true;
  await updateLineItems(lineItemsArray);
  cartIsLocked.value = false;
}

async function removeLineItemsWrapper(lineIdsArray) {
  if (cartIsLocked.value === true) return;
  cartIsLocked.value = true;
  await removeLineItems(lineIdsArray);
  cartIsLocked.value = false;
}
</script>
