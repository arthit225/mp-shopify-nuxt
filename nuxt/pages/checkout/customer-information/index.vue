<template>
  <div>
    <div
      v-show="loading == false"
      class="max-w-[1200px] mx-auto futura-std-regular py-20"
    >
      <div class="flex flex-col md:flex-row">
        <div class="w-full max-w-[550px] border-r pr-8">
          <CheckoutShippingForm @update-loading="updateLoading" />
        </div>
        <div class="w-full pl-8">
          <CheckoutCartDisplay />
        </div>
      </div>
    </div>
    <div
      v-show="loading"
      class="w-full h-screen flex flex-col justify-center items-center"
    >
      <div class="loader"></div>
      <div class="mt-4 text-extra-small flex flex-col text-center">
        <span>Do not close the tab.</span>
        <span>Thank you for your patience.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout',
});

const loading = ref(false);

function updateLoading(value) {
  loading.value = value;
  console.log('updatedLoader to value', value)
}
</script>
