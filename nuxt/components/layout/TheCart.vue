<template>
  <div
    v-if="cart"
    ref="theCartEl"
    id="cart"
    class="
      cart
      fixed
      right-0
      top-0
      w-full
      h-full
      overflow-auto
      bg-white
      z-[99]
      shadow-md
    "
  >
    <div class="w-full h-full relative">
      <div
        class="
          flex
          flex-row-reverse
          justify-between                
          items-center
          pt-6
          px-6
         
        ">
        <span
          v-if="lineItems.length > 0"
          :aria-label="'You have ' + lineItems.length + (lineItems.length > 1 ? ' items ' : ' item ') +  'in your cart'"
          class="uppercase text-xs"
        >
          ({{ lineItems.length }}) {{ lineItems.length > 1 ? "items" : "item" }}
        </span>
        <button
          aria-label="Toggle Cart"
          @click="toggleMiniCart"
          class="js-toggle-cart flex items-center justify-center w-10 h-10"
        >
          <IconsCloseX />
          <span class="sr-only">Toggle Cart</span>
        </button>
      </div>

      <div
        v-if="lineItems.length > 0"
        class="
          px-8
          pt-0
          pb-10
          uppercase
          text-center                
        "
      >
        <div v-if="distanceToFreeShipping() == 0" class="mb-2 text-xs">
          Congratulations! You get Free Shipping!
        </div>
        <div v-else>
          <div
            class="mb-2 text-xs"
          >
            {{`Add ${money(distanceToFreeShipping())} More For Free Shipping`}}
          </div>
        </div>
        <div class="relative w-full distance-to-free-ship">
          <div
            class="absolute left-0 top-0 h-full distance-to-free-ship__line"
            :style="{ width: `${freeShippingPercent()}%` }"
          ></div>
        </div>
      </div>

      <div v-if="lineItems" class="mt-6 pl-8 pr-10">
        <div
          v-for="lineItem in lineItems"
          :key="lineItem.id"
          class="mb-4 mini-cart-line-item w-full"
        >
          <div class="flex w-full ">
            <nuxt-link
              v-if="lineItem.merchandise.product.featuredImage?.transformedSrc"
              :to="'/product/' + lineItem.merchandise.product.handle"
              class="block mr-4 w-[120px]"
            >
              <lazyload-img
                :key="lineItem.merchandise.product.featuredImage.transformedSrc"
                :src="lineItem.merchandise.product.featuredImage.transformedSrc"
                figureClasses="ratio-container block mb-4 md-down:mb-2.5"
                pictureClasses="h-full block"
                imgClasses="block object-cover"
                :absolute="true"
                :forceRatio="{
                  force: true,
                  aspectRatio: 0.8
                }"
               />
            </nuxt-link>

            <div class="text-extra-small flex flex-wrap flex-col flex-1 ">
              <div
                class="
                  w-full
                  flex
                  flex-wrap
                  justify-between
                  pb-2 pt-4
                "
              >
                <h3 class="flex-1 text-sm tracking-wide">
                  <nuxt-link
                    :to="'/product/' + lineItem.merchandise.product.handle"
                   >
                  {{ lineItem.merchandise.product.title }}
                  </nuxt-link>
                </h3>
            
                <span class="text-sm">
                  {{ money(lineItem.estimatedCost.totalAmount) }}
                  <span
                    v-if="
                      parseFloat(lineItem.estimatedCost.totalAmount.amount) !==
                      parseFloat(lineItem.estimatedCost.subtotalAmount.amount)
                    "
                    class="line-through opacity-60">
                    {{ money(lineItem.estimatedCost.subtotalAmount) }}
                  </span>
                </span>
                <ul class="w-full opacity-50 pt-1">
                  <li
                    v-for="option in lineItem.merchandise.selectedOptions"
                    :key="option.name"
                    :class="option.name === 'Title' ? 'hidden' : ''"
                  >
                    {{ option.name }}: {{ option.value }}
                  </li>
                </ul>
                <ul v-if="lineItem.sellingPlanAllocation" class="w-full opacity-50 pt-1">
                  <li>
                    {{ lineItem.sellingPlanAllocation.sellingPlan.name }}
                  </li>
                </ul>
                <ul v-if="lineItem.attributes?.length" class="w-full opacity-50 pt-1">
                  <li
                    v-for="attribue in lineItem.attributes"
                    :key="attribue.value"
                  >
                    {{ attribue.key }}: {{ attribue.value }}
                  </li>
                </ul>                              
              </div>
             
             <div class=" flex">
                <div class="mini-cart-qty-adjuster">                
                  <label class="sr-only">Quantity</label>
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
                          ])">
                    -
                  </button>
                  <span class="mini-cart-qty-adjuster-qty">
                    {{ lineItem.quantity }}
                  </span>
                  <button
                    @click="
                      updateLinesItemsWrapper([
                        {
                          id: lineItem.id,
                          quantity: lineItem.quantity + 1,
                        },
                      ])
                    "
                    class="text-large default">
                    <IconsPlus/>
                  </button>               
                </div>

                <button
                  @click="removeLineItemsWrapper([`${lineItem.id}`])"
                  class="lowercase text-xs opacity-50 line-item-remove fancy-underline leading-none"
                  >
                  Remove
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div
        v-if="lineItems.length > 0"
        class="px-8 py-6 mini-cart-discount-code-slot">
        <div
          v-if="
            cart.discountCodes &&
            cart.discountCodes.length > 0 &&
            cart.discountCodes[0].code === ''
          ">
          <label
            class="block mb-2 text-xs uppercase"
            for="mini-cart-discount-code">Discount code
          </label>
            <div class="flex bg-white h-10  mini-cart-discount-code-inputs">
              <input
              v-model.trim="discountCode"
              type="text"
              id="mini-cart-discount-code"
              class="block w-full pl-2"
              @keypress.enter="triggerDiscountCode([discountCode])"
              />
              <button
                type="button--primary"
                class="text-xs uppercase px-4 tracking-wider "
                @click="triggerDiscountCode([discountCode])"
                >
                Apply
              </button>
            </div>
        </div>

        <div
          v-if="
            cart.discountCodes &&
            cart.discountCodes.length > 0 &&
            cart.discountCodes[0].code !== '' &&
            cart.discountCodes[0].applicable
          "
          class="uppercase text-xs"
        >
          Active Code
          <span class="bg-blue-100 inline-block p-2 mt-2 rounded-full ">
            {{cart.discountCodes[0].code}}
              <button
                @click="triggerDiscountCode([''], true)"
                class="default cursor-pointer text-small inline-block line-item-remove underline"
              >
                Remove <span class="sr-only">disocunt code</span>
              </button>
          </span>

        </div>
        <div
          v-else-if="
            cart.discountCodes &&
            cart.discountCodes.length > 0 &&
            cart.discountCodes[0].code !== '' &&
            cart.discountCodes[0].applicable === false
          "
          class="border-[red] text-[red] py-1 mt-2"
        >
          Discount code is invalid
          <button
            @click="triggerDiscountCode([''], true)"
            class="default cursor-pointer text-small px-2 inline-block"
          >
            X
          </button>
        </div>
      </div>

      <div v-if="lineItems.length > 0" class="px-8 pt-6 bg-gray-50">
        <div
          v-if="cart.estimatedCost"
          class=" flex justify-between uppercase mb-4"
          >
          <span>SubTotal</span>
          <span>{{ money(cart.estimatedCost.subtotalAmount) }}</span>
        </div>

        <div
          v-if="
            cart.discountCodes &&
            cart.discountCodes.length > 0 &&
            cart.discountCodes[0].code !== '' &&
            cart.discountCodes[0].applicable
          "
          class=" flex justify-between uppercase mb-4"
          >
          <span>Discount</span>
            <span>{{ money(disCountEstimatedCost) }}</span>
        </div>
        <div
          v-if="cart.estimatedCost"
          class=" flex justify-between uppercase mb-4"
          >
          <span>Total</span>
          <span>{{ money(totalEstimatedCostBeforeTaxes) }}</span>
        </div>
    
        <div class="">
          <nuxt-link
            :to="cart.checkoutUrl"
            :target="'_blank'"
            class="button--black w-full block uppercase">
            <span class="sr-only">click this link to</span> checkout
          </nuxt-link>
        </div>

        </div>
        <div v-if="lineItems.length > 0" class="px-6 text-center py-4 text-xs">
          Duties and taxes are calculated at the checkout
        </div>
        <div v-else-if="lineItems.length == 0" class="px-6 text-center py-4 text-xs">
          Your cart is empty.
        </div>
      </div>

    <Teleport v-if="cartIsOpen" to="body">
      <SnippetsBackgroundBlocker
        :z-index="10"
        :triggerFunction="toggleMiniCart"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
const theCartEl = ref();
const {
  cartId,
  cartEl,
  cart,
  lineItems,
  cartIsOpen,
  cartCount,
  toggleMiniCart,
  updateLineItems,
  removeLineItems,
  applyDiscountCode,
  getCartId,
  getCart,
  createCart,
  destroyCart
} = useCart();


// POLL
const POLL_INTERVAL = 10000;
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

const isRemovedCart = () => {
  console.log('isRemovedCart', cart.value)
  if (!cart.value || !cart.value.id) { 
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
      destroyCart()
      const tempCart = await createCart();
      /* Set the localstorage item to the returned ID */
      window.localStorage.setItem("cartId", `${tempCart.id}`);
      cart.value = tempCart;
      console.log('NOT AVAILABLE CART')
      resolve()
    }
    attempts++;

    if (isRemovedCart()) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};

onMounted(async () => {
  cartEl.value = theCartEl;
  cartId.value = getCartId();
  let tempCart = await getCart(cartId.value);
  if (!tempCart) {
    tempCart = await createCart();

    /* Set the localstorage item to the returned ID */
    window.localStorage.setItem("cartId", `${tempCart.id}`);
    cart.value = tempCart;
  } else {
    cart.value = tempCart;
  }
  cartId.value = tempCart.id;
  poll({
     isAvailableCart: isAvailableCart,
     isRemovedCart: isRemovedCart,
     interval: POLL_INTERVAL,
     cart: cart.value
     })
   .then(user => console.log(user))
   .catch(err => console.error(err));
});

watch(cart, (updatedCart) => {
  let count = 0;
  if (!updatedCart) {
    cartCount.value = 0
    return 
  }
  if (!updatedCart.lines) return (lineItems.value = []);
  const result = updatedCart.lines.edges.map((line) => {
    return line.node;
  });
  cartCount.value = updatedCart.totalQuantity;
  lineItems.value = result;
  poll({
    isAvailableCart: isAvailableCart,
    isRemovedCart: isRemovedCart,
    interval: POLL_INTERVAL,
    cart: updatedCart
  })
   .then(user => console.log(user))
   .catch(err => console.error(err));
});

const { money } = useUtils();
const discountCode = ref("");
const cartIsLocked = ref(false);
const minicartSettings = inject("minicartSettings");
onMounted(() => {
  console.log("cart data");
  console.log(cart, cart.value);
});

function distanceToFreeShipping() {
  const threshold = parseInt(minicartSettings.freeShippingThreshold) / 100;
  const totalPriceWithTaxes = parseFloat(
    cart.value.estimatedCost.totalAmount.amount
  );
  if (totalPriceWithTaxes >= threshold) {
    return 0;
  } else {
    const currencyCode = cart.value.estimatedCost.totalAmount.currencyCode;
    const amount = parseFloat(threshold - totalPriceWithTaxes).toFixed(2)
    return {
      amount,
      currencyCode
    };
  }
}

function freeShippingPercent() {
  const threshold = parseInt(minicartSettings.freeShippingThreshold) / 100;
  const totalPriceWithTaxes = parseFloat(
    cart.value.estimatedCost.totalAmount.amount
  );

  return (totalPriceWithTaxes * 100) / threshold > 100
    ? 100
    : (totalPriceWithTaxes * 100) / threshold;
}

function triggerDiscountCode(discountCodeArray, remove = false) {
  if (remove) {
    applyDiscountCode(discountCodeArray);
  } else {
    if (discountCodeArray[0].length === 0) return;
    applyDiscountCode(discountCodeArray);
  }
  discountCode.value = "";
}

const disCountEstimatedCost = computed(() => {

  let totalPriceWithTaxes = null;
  let totalTaxAmount = null;
  let totalDutyAmount = null;
  let totalSubTotalAmount = null;

  try {
    totalPriceWithTaxes = parseFloat(
      cart.value.estimatedCost.totalAmount.amount
    );
  } catch (err) {
    totalPriceWithTaxes = 0;
  }

  try {
    totalTaxAmount = parseFloat(cart.value.estimatedCost.totalTaxAmount.amount);
  } catch (err) {
    totalTaxAmount = 0;
  }

  try {
    totalDutyAmount = parseFloat(
      cart.value.estimatedCost.totalDutyAmount.amount
    );
  } catch (err) {
    totalDutyAmount = 0;
  }

    try {
    totalSubTotalAmount = parseFloat(
      cart.value.estimatedCost.subtotalAmount.amount
    );
  } catch (err) {
    totalSubTotalAmount = 0;
  }

  const resultTotal =
    Math.round(
      (totalPriceWithTaxes -
        totalTaxAmount -
        totalDutyAmount +
        Number.EPSILON) *
        100
    ) / 100;

  const amount = 
    totalSubTotalAmount - resultTotal;

  const currencyCode = cart.value.estimatedCost.totalAmount.currencyCode;
  return {
    amount,
    currencyCode,
  };
});

const totalEstimatedCostBeforeTaxes = computed(() => {

  let totalPriceWithTaxes = null;
  let totalTaxAmount = null;
  let totalDutyAmount = null;

  try {
    totalPriceWithTaxes = parseFloat(
      cart.value.estimatedCost.totalAmount.amount
    );
  } catch (err) {
    totalPriceWithTaxes = 0;
  }

  try {
    totalTaxAmount = parseFloat(cart.value.estimatedCost.totalTaxAmount.amount);
  } catch (err) {
    totalTaxAmount = 0;
  }

  try {
    totalDutyAmount = parseFloat(
      cart.value.estimatedCost.totalDutyAmount.amount
    );
  } catch (err) {
    totalDutyAmount = 0;
  }

  const amount =
    Math.round(
      (totalPriceWithTaxes -
        totalTaxAmount -
        totalDutyAmount +
        Number.EPSILON) *
        100
    ) / 100;

  const currencyCode = cart.value.estimatedCost.totalAmount.currencyCode;
  return {
    amount,
    currencyCode,
  };
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

<style scoped lang="scss">
.mini-cart-discount-code-inputs {
  border: solid 1px;
}
#cart {
  @screen sm {
    max-width: toRem(500);
  }
}
.distance-to-free-ship {
  border: solid 1px black;
  height: toRem(8);
  &__line {
    background: black;
    transition: all ease .3s;
  }
}
.mini-cart-qty-adjuster {
  display: inline-flex;
  width: 94px;
  padding: 0 .25rem;
  justify-content: space-between;
  align-items: center;
  // margin-left: auto;
  margin-bottom: auto;
  border: solid 1px #ccc;

  button {    
    width: 32px;
    height: 32px;  
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;    
    svg {
      width: toRem(14);
      height: toRem(14);
    }
  }
  .mini-cart-qty-adjuster-qty {    
    width: 20px;
    height: 32px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: auto;    
  }
}
.line-item-remove {
  // background: var(--mp-cream);
  // width: 32px;
  // height: 32px;  
  // opacity: 1;
  margin: auto 0 0 auto;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // background: rgb(239, 230, 225);
  // svg {
  //   width: toRem(10);
  //   height: toRem(10);
  // }
}
.js-toggle-cart {
  svg {
    width: toRem(14);
    height: toRem(14);
  }
}
.cart {
  transform: translateX(100%);
  transition: all 0.2s ease-in-out;
}
.open {
  transform: translateX(0);
}
</style>
