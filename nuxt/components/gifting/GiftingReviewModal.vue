<template>
  <SnippetsBackgroundBlocker
    :zIndex="99"
    v-if="showModal"
    @click="emit('close-modal')"
  >
    <div
      @click.stop
      class="fixed w-[95%] h-[95%] md:w-[70%] md:h-[70%] max-w-[931px] max-h-[635px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-10 cursor-auto overflow-auto p-4"
    >
      <div v-if="!loading" class="text-right">
        <button @click="emit('close-modal')" class="sticky top-4 right-4">
          <IconsCloseX />
        </button>
        <h1 class="text-center py-10 saol-display-light-italic text-[2.688rem] md:text-[3.25rem] md:leading-[160%]">Adding Custom Gift to Cart</h1>
        <div class="text-center mb-8">
          Quantity
          <button class="inline-block w-8 h-8" @click="giftQuantity--">
            -
          </button>
          <span class="inline-block w-6 text-center">
            <input
              disabled
              type="text"
              class="inline-block w-full text-center bg-transparent"
              v-model="giftQuantity"
            />
          </span>
          <button class="inline-block w-8 h-8" @click="giftQuantity++">
            +
          </button>
        </div>
        <div class="flex flex-col text-center gap-4 mb-8">
          <div
            v-for="number in giftQuantity"
            :key="number"
            class="flex flex-col justify-center gap-3 items-center py-3 js-custom-gift-wrapper"
            :class="{ 'border-t': number > 1 }"
          >
            <label for=""
              >NAME GIFT ({{ number }})
              <input
                type="text"
                class="js-name ml-2 w-[200px] border-b border-black focus:outline-none"
              />
            </label>
            <textarea
              v-if="number===1"
              name=""
              id=""
              cols="30"
              rows="4"
              v-model="giftingMessage"
              class="js-message p-3 w-[400px] max-w-[100%] border-black border"
            />
            <textarea
              v-else
              name=""
              id=""
              cols="30"
              rows="4"
              class="js-message p-3 w-[400px] max-w-[100%] border-black border"
            />
          </div>
        </div>
        <div class="text-center">
          <button
            @click="handleAddToCart"
            class="button--black !inline-block mx-auto"
          >
            Add To Cart
          </button>
        </div>
      </div>
      <div v-else class="w-full h-full flex justify-center items-center">
        <button @click="emit('close-modal')" class="absolute top-4 right-4">
          <IconsCloseX />
        </button>
        <div class="flex flex-col gap-2 justify-center items-center">
          <GiftingSpinner />
          Creating your gift card...
        </div>
      </div>
    </div>
  </SnippetsBackgroundBlocker>
</template>

<script setup>
import { useStorage } from '@vueuse/core';
const {
  openGiftCart,
  giftingCarts,
  giftingProductList,
  giftingMessage,
  giftingPackaging,
} = useGiftCart();
const {
  getFirstVariantID
} = useProducts();
const { createCart, addToCart2, getCart, cartNoteUpdate, cartAttributeUpdate } =
  useCart();
const { showModal } = defineProps(['show-modal']);
const emit = defineEmits(['close-modal', 'ready-to-checkout']);
const loading = ref(false);
let query = '';


async function handleAddToCart() {
  if (!giftingPackaging.value) {
    alert('Please select packaging');
    return;
  }
  const lineItems = [];
  lineItems.push({
    merchandiseId: await getFirstVariantID(giftingPackaging.value),
    quantity: 1,
    attributes: [
      {
        key: 'packaging',
        value: 'true',
      },
    ],
  });

  if (giftingProductList.value.length === 0) {
    alert('Please select at least one product for the gift');
    return;
  }
  for (const productID of giftingProductList.value) {
    lineItems.push({
      merchandiseId: await getFirstVariantID(productID),
      quantity: 1,
      attributes: {
        key: 'gift',
        value: 'true',
      },
    });
  }
  const gift_merchandiseID = await getFirstVariantID("gid://shopify/Product/6924232523833")
  lineItems.push({
    merchandiseId: gift_merchandiseID,
    quantity: 1,
    attributes: [
      {
        key: '_placeholder',
        value: 'true',
      },
      {
        key: 'name',
        value: 'null',
      },
      {
        key: 'message',
        value: 'null',
      },
    ],
  });

  const wrapperEls = document.querySelectorAll('.js-custom-gift-wrapper');
  loading.value = true;
  const newCarts = [];
  for (let i = 0; i < wrapperEls.length; i++) {
    const name = wrapperEls[i].querySelector('.js-name');
    const message = wrapperEls[i].querySelector('.js-message');
    if (name.value && message.value) {
      const cart = await createCart();
      const cartNote = await cartNoteUpdate(message.value, cart.id);
      const lineItem = lineItems.find((line) => {
        return (
          line.merchandiseId === gift_merchandiseID
        );
      });
      lineItem.attributes[1].value = name.value;
      lineItem.attributes[2].value = message.value;
      await addToCart2(lineItems, cart.id);
      console.log('lineItems', lineItems)
      await cartAttributeUpdate({ key: 'name', value: name.value }, cart.id);
      const newCart = await getCart(cart.id);
      console.log('addedCart', i, newCart);
      newCarts.push(newCart);
    } else {
      alert( (i + 1) + 'th Gift can\'t be add because name or message is empty');
      loading.value = false;
      return
    }
  }
  giftingCarts.value = [...giftingCarts.value, ...newCarts];
  loading.value = false;
  resetFlow();
  emit('ready-to-checkout');
  openGiftCart();
}

function resetFlow() {
  giftingMessage.value = '';
  giftingPackaging.value = '';
  giftingProductList.value = [];
}

const giftQuantity = ref(1);
</script>
