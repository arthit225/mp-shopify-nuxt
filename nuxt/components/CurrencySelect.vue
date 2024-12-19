<template>
  <div>
    <select v-model="selectedCurrency" name="currency" id="currency">
      <option value="US">USD</option>
      <option value="CA">CAD</option>
    </select>
  </div>
</template>

<script setup>
  import { useStorage } from '@vueuse/core'
  const {currency, setCurrency} = useCurrency()
  const selectedCurrency = ref(currency.value)

  watch(selectedCurrency, (newValue) => {
    if(!confirm('Note: If you accept to change currency, the items in your cart will be lost.')) return;
    const cartId = useStorage('cartId')
    cartId.value = null
    setCurrency(newValue, {
      expires: 214748364
    })
    window.location.reload()
  })
</script>
