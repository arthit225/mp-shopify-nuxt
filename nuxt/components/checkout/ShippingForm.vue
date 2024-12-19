<template>
  <div>
    <h1
      class="text-sm heading-xs leading-[1.50] futura-std-regular mb-6"
    >
      Customer & shipping information
    </h1>
    <form @submit.prevent="onSubmit" action="">
      <div class="flex border p-2 mb-8 futura-std-regular rounded-md">
        <label class="min-w-[10.625rem] inline-block" for="email">Email</label>
        <input
          v-model="form.email"
          required
          class="outline-none w-full inline-block"
          id="email"
          type="text"
          placeholder="Email"
        />
      </div>
      <h2 class="text-small leading-[150%] mb-3">
        Shipping Address
      </h2>
      <div class="border rounded-md">
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="firstName"
            >First name</label
          >
          <input
            v-model="form.firstName"
            required
            class="outline-none w-full inline-block"
            id="firstName"
            type="text"
            placeholder="First name"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="lastName"
            >Last name</label
          >
          <input
            v-model="form.lastName"
            required
            class="outline-none w-full inline-block"
            id="lastName"
            type="text"
            placeholder="Last name"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="company"
            >Company</label
          >
          <input
            v-model="form.company"
            class="outline-none w-full inline-block"
            id="company"
            type="text"
            placeholder="Company (optional)"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="address"
            >Address</label
          >
          <input
            v-model="form.address"
            required
            class="outline-none w-full inline-block"
            id="address"
            type="text"
            placeholder="Address"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="address2"
            >Apt, suite, etc.</label
          >
          <input
            v-model="form.address2"
            class="outline-none w-full inline-block"
            id="address2"
            type="text"
            placeholder="Apt, suite, etc."
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="city">City</label>
          <input
            v-model="form.city"
            required
            class="outline-none w-full inline-block"
            id="city"
            type="text"
            placeholder="City"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="country"
            >Country</label
          >
          <input
            v-model="form.country"
            required
            class="outline-none w-full inline-block"
            id="country"
            type="text"
            placeholder="Country"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="state"
            >State</label
          >
          <input
            v-model="form.state"
            required
            class="outline-none w-full inline-block"
            id="state"
            type="text"
            placeholder="State"
          />
        </div>
        <div class="flex border-b px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="zip"
            >ZIP code</label
          >
          <input
            v-model="form.zip"
            required
            class="outline-none w-full inline-block"
            id="zip"
            type="text"
            placeholder="ZIP code"
          />
        </div>
        <div class="flex px-2 py-2 futura-std-regular">
          <label class="min-w-[10.625rem] inline-block" for="phone"
            >Phone</label
          >
          <input
            v-model="form.phone"
            required
            class="outline-none w-full inline-block"
            id="phone"
            type="text"
            placeholder="Phone (optional)"
          />
        </div>

        <button class="button--secondary mt-6 float-right">Continue</button>
      </div>
    </form>
  </div>
</template>

<script setup>
const emit = defineEmits(['update-loading']);

const { cartAttributesUpdate, getCart, cartId } = useCart();

const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  company: '',
  address: '',
  address2: '',
  city: '',
  country: '',
  state: '',
  zip: '',
  phone: '',
});

async function onSubmit() {
  emit('update-loading', true);
  console.log('wtf works')
  try {
    const response = await cartAttributesUpdate([
      { key: 'email', value: form.email },
      {
        key: 'shipping_address',
        value: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          company: form.company,
          address: form.address,
          address2: form.address2,
          city: form.city,
          country: form.country,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
        }),
      },
    ]);
    console.log(response);
    console.log(await getCart(cartId.value));
    const shippingOptions = await prepareShippingOptions()
    console.log(shippingOptions)
  } catch (err) {
    console.error(err);
  }

  emit('update-loading', false)
}

async function prepareShippingOptions(){
  try {
    const response = await $fetch('/api/shipping-options', {
      method: 'POST',
      body: {
        cartId: cartId.value
      },
    });
    console.log(response)
    return response
  } catch (err) {
    console.log(err)
    return err
  }
}
</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>
