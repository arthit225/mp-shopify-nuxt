<template>
  <SnippetsBackgroundBlocker
    @click="closeGiftCart"
    v-show="isGiftCartOpen"
    :zIndex="99"
    :opacity=".2"
  >
    <div
      @click.stop
      class="
        w-[320px]
        max-w-[453px]
        mt-bag
        transform
        bg-white
        z-10
        cursor-auto        
        p-4
        pb-0
      "
    >
      <button @click="closeGiftCart" class="absolute top-4 right-4">
        <IconsCloseX />
      </button>

      <div class="mt-bag__inner overflow-auto  max-h-[540px]">

        <h3 class="text-left mb-4 mt-2 uppercase">Your Gifts</h3>

        <ClientOnly>
          <ul class="text-left">
            <li
              v-for="cart in giftingCarts" :key="cart.id"
              class="py-4">
              <div class="flex">
                <div class="flex-[1]">
                  <img :src="retrieveCartImageSource(cart)" alt="" />
                </div>
                <div class="flex-[3] md:ml-2">
                  <div class="uppercase mb-2">
                    {{ cart.attributes[0].value }}
                  </div>
                  <div class="flex gap-4 text-xs">
                    <div class="text-gray-400">
                      {{ money(cart.estimatedCost.totalAmount) }}
                    </div>
                    <div class="text-gray-400">
                      {{ cart.lines.edges.length - 2 }} items
                    </div>
                  </div>
                </div>
                <div class="flex-[1] text-right">
                  <a
                    :href="cart.checkoutUrl"
                    target="_blank"
                    class="button--black inline-block uppercase"
                    >Checkout</a
                  >
                  <button
                    @click="destroyCart(cart.id)"
                    class="inline-block text-gray-400 ml-auto text-xs fancy-underline mt-3"
                  >
                    remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </ClientOnly>
      </div>
    </div>
  </SnippetsBackgroundBlocker>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import axios from 'axios'
const isUnmounted = ref(false);
async function isAvailableCart(cart) {
  console.log('checking isAvailableCart', cart.checkoutUrl)
  try {
    const cartByID = await getCart(cart.id);
    console.log('cartByID', cartByID)
    return cartByID ? true : false
  } catch(e) {
    console.log('error', e)
    return false
  }
}

const isRemovedCart = (cart) => {
  console.log('isRemovedCart', cart)
  if (giftingCarts.value.filter((c) => c.id === cart.id).length == 0) { 
    return 1 //removed
  };
  return 0
}

const poll = async ({ isAvailableCart, isRemovedCart, interval, cart, maxAttempts }) => {
  let attempts = 0;
  console.log("TEST poll")
  const executePoll = async (resolve, reject) => {
    console.log('polling')
    if (isUnmounted.value) {
      reject()
    }
    const result = await isAvailableCart(cart);
    if (!result) {
      if (!isUnmounted.value) {
        setTimeout(function() {destroyCart(cart.id)}, 300)
      }
      console.log('NOT AVAILABLE CART')
      resolve()
    }
    attempts++;

    if (isRemovedCart(cart)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};
const { money } = useUtils();
const {
  isGiftCartOpen,
  closeGiftCart,
  giftingCartsCount,
  giftingCarts,
  giftingCartIds,
  giftingMessage,
  giftingProductList,
  giftingPackaging,
  giftingPackingList,
} = useGiftCart();
const { getCart } = useCart();


const POLL_INTERVAL = 1000;



onMounted(async () => {
  giftingProductList.value = useStorage("gifting-products", []).value;
  giftingPackingList.value = useStorage("gifting-packing-list", []).value;
  giftingPackaging.value = useStorage("gifting-packaging", null).value;
  giftingMessage.value = useStorage("gifting-message", null).value;
  giftingCartIds.value = useStorage("gifting-carts", []).value;
  console.log('useStorage("gifting-carts", [])', useStorage("gifting-carts", []))
  console.log('onMounted giftingCartIds', giftingCartIds.value)
  const tempCartArray = [];
  for (let i = 0; i < giftingCartIds.value.length; i++) {
    const cart = await getCart(giftingCartIds.value[i]);
    tempCartArray.push(cart);
  }
  console.log('giftingCartIds.value', giftingCartIds.value, 'tempCartArray', tempCartArray)
  giftingCarts.value = tempCartArray;
  giftingCarts.value.forEach((cart)=>{
    poll({
      isAvailableCart: isAvailableCart,
      isRemovedCart: isRemovedCart,
      interval: POLL_INTERVAL,
      cart: cart
    })
    .then(user => console.log(user))
    .catch(err => console.error(err));
  })

});

watch(giftingCarts, (newGiftingCarts, oldGiftingCarts) => {
  const newCartIds = [];
  const addedCarts = newGiftingCarts.filter(
    (cart) => {
      return !oldGiftingCarts.filter(c=>c.id === cart.id).length
    }
  )
  console.log('addedCarts', addedCarts)
  newGiftingCarts.forEach((cart) => {
    newCartIds.push(cart.id);
  });

  addedCarts.forEach((cart)=>{
    console.log('addedCarts poll', cart)
    poll({
      isAvailableCart: isAvailableCart,
      isRemovedCart: isRemovedCart,
      interval: POLL_INTERVAL,
      cart: cart
    })
    .then(user => console.log(user))
    .catch(err => console.error(err));
  })

  giftingCartIds.value = newCartIds;
  console.log('giftingCartIds.value in watch', giftingCartIds.value)
  giftingCartsCount.value = newGiftingCarts.length;
  if (!giftingCartsCount.value ) {
    closeGiftCart()
  }
});
watch(giftingCartIds, (newgiftingCartIds) => {
  const giftingCartIdsLocalStorage = useStorage("gifting-carts", []);
  giftingCartIdsLocalStorage.value = newgiftingCartIds;
});
watch(giftingMessage, (newGiftingMessage) => {
  const giftingMessageLocalStorage = useStorage("gifting-message", "");
  giftingMessageLocalStorage.value = newGiftingMessage;
});

watch(giftingProductList, (newGiftingProductList) => {
  const giftingProductListLocalStorage = useStorage("gifting-products", []);
  giftingProductListLocalStorage.value = newGiftingProductList;
});

watch(giftingPackingList, (newGiftingPackingList) => {
  const giftingPackingListLocalStorage = useStorage("gifting-packing-list", []);
  giftingPackingListLocalStorage.value = newGiftingPackingList;
});

watch(giftingPackaging, (newGiftingPackaging) => {
  const giftingPackagingLocalStorage = useStorage("gifting-packaging", null);
  giftingPackagingLocalStorage.value = newGiftingPackaging;
});

function retrieveCartImageSource(cart) {
  const cartItem = cart.lines.edges.find((line) => {
    for (let i = 0; i < line.node.attributes.length; i++) {
      if (line.node.attributes[i].key === "packaging") {
        return true;
      }
    }
  });
  if (cartItem) {
    return cartItem.node.merchandise.product.featuredImage.transformedSrc;
  }
  return null;
}

function destroyCart(cartId) {
  giftingCarts.value = giftingCarts.value.filter((cart) => cart.id !== cartId);
}
onUnmounted(()=>{
  isUnmounted.value = true
})
</script>
<style lang="scss" scoped>
.fancy-underline:before {
  bottom: 0.2em;
}
 .mt-bag {
  top: 100px;
  right: .25rem;
  transform: none !important;
  position: absolute;
  width: calc(100vw - .5rem);
  @screen md{
    margin-right:5px;
    right: -8px;
    width: 414px;
  }
  @screen lg-down {

  }
  @screen md-down{
    top: 100px;
    position: fixed;
    margin-right: 20px;
  }
  @screen lg {
    top: 108px;
    right: 179px;
    width: 414px;
  }
  @screen sm {
    &::before {
      content: "";
      display: block;
      background: white;
      width: 2rem;
      height: 2rem;
      position: absolute;
      left: 50%;
      top: -1rem;z-index: 9;
      transform: translate(-50%, 0) rotate(45deg);
    }
  }
  .scrolled & {
    top: 64px;
    position: fixed;
    @screen lg {
      top: 72px;
    }
  }
}
</style>