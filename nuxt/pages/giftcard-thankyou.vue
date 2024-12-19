<template>
  <div class="text-center">
    <div v-if="route?.query?.success == true">
      <h2 class="text-2xl">Thank you!</h2>
      {{ route?.query?.message }}
    </div>
    <div v-else>
      <h2 class="text-2xl">Sorry, but it's failed.</h2>
      {{ route?.query?.message }}
    </div>
    <div class="hidden">
      {{ route?.query }}
      {{ invoiceID }}
    </div>
  </div>
</template>
<script setup>
const {
  invoiceID,
  closeAnInvoice,
  sendEmailToGuest,
} = useZenotiAPIs();
const route = useRoute();
console.log('route in thank-you', route)
route.meta.layout='blank'
definePageMeta({
   layout: false
});
onMounted(async ()=>{
  const invoice_id = invoiceID.value || route?.query?.invoice_id
  console.log('invoiceID.value', invoiceID.value, 'invoice_id', invoice_id)
  if (invoice_id) {
    if (route?.query?.success == true) {
      await closeAnInvoice(invoice_id)
      console.log("Closing the invoice after payment was made successfully")
      await sendEmailToGuest(invoice_id)
    } else {
      await closeAnInvoice(
        invoice_id,
        true,
        {
            "StatusCode": 1,
            "Message": route?.query?.message,
            "InternalMessage": "Closing Invoice"
        },
      )
      console.log("Trying to close the invoice after payment was failed")
    }
    
    invoiceID.value = null
  }
})

</script>
