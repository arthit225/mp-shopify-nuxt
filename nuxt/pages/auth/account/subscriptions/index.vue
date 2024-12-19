<template>
  <article class="account-wrapper">
    <AuthSidebar />
    <section class="account-main">
      <div class="account-main__inner">

        <div v-if="customerSubscriptions?.length">
          <div v-for="sub in customerSubscriptions" :key="sub.id">
            ID: {{ sub.id }}<br />
            STATUS: {{ sub.status }}<br />
            order_interval_frequency: {{ sub.order_interval_frequency }}<br />
            order_interval_unit: {{ sub.order_interval_unit }}<br />
            product_title: {{ sub.product_title }}<br />
            next_charge_scheduled_at: {{ sub.next_charge_scheduled_at }}<br />
            <button @click="cancelSubscription(sub.id)" class="button button--primary">
              cancelSubscription
            </button>
          </div>
        </div>
        <div v-else class="text-center heading-m mb-8">
          You don't have any active subscriptions.
        </div>
      </div>
    </section>
  </article>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const { token } = useAuth();
const customerSubscriptions = ref([]);

const query = `
  query MyQuery {
    customer(customerAccessToken: "${token.value}") {
      email
    }
  }
`;

const customerData = await useShopify({ query });
const customer = customerData.data.customer;

// we need to get the email of the current logged in customer
// to retrive the subscriptions by email.
console.log(customer.email)
const email = customer.email

const subscriptions = await $fetch("/api/recharge-customer", {
  method: "POST",
  body: JSON.stringify({
    "email": email
  })
})

customerSubscriptions.value = subscriptions.subscriptions

console.log(customerSubscriptions.value)

async function cancelSubscription(id) {
  const cancel = await $fetch("/api/recharge-cancel-subscription", {
    method: "POST",
    body: JSON.stringify({
      "id": id
    })
  })
  console.log(cancel)
  if (cancel.result == "" || cancel.result == null) {
    customerSubscriptions.value = []
  }
}
</script>