<template>
  <article class="account-wrapper">
    <AuthSidebar />
    <section class="account-main">
      <div class="account-main__inner">
        
        <h2 class="heading-m mb-8 text-center">Orders</h2>
        
        <table class="w-full">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Payment Status</th>
              <th>Fulfillment Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in customer.orders.edges" :key="order.orderNumber">
              <td>
                <nuxt-link class="underline" :to="{
                  name: 'auth-account-orders-id',
                  params: { id: order.node.id },
                }">#{{ order.node.orderNumber }}</nuxt-link>
              </td>
              <td>
                {{
                    new Date(order.node.processedAt)
                      .toDateString()
                      .substring(4)
                      .replaceAll(' ', ', ')
                }}
              </td>
              <td>{{ decodeFinancialStatus(order.node.financialStatus) }}</td>
              <td>{{ FULFILLMENT_STATUS[order.node.fulfillmentStatus] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </article>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const { FULFILLMENT_STATUS, decodeFinancialStatus } = useUtils();
const { token } = useAuth()

const query = `
  query MyQuery {
    customer(customerAccessToken: "${token.value}") {
      orders(first: 100, reverse: true) {
        edges {
          node {
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            currencyCode
            id
          }
        }
      }
    }
  }
`;

const customerData = await useShopify({ query });
const customer = customerData.data.customer;

customer.orders.edges.forEach((edge) => {
  edge.node.id = btoa(edge.node.id);
});

onMounted(() => {
  console.log(customerData);
});
</script>

<style scoped>
td,
th {
  border: 1px solid #efeeee;
  text-align: left;
  padding: 1rem;
}

tr:nth-child(even) {
  background-color: #f7f7f7;
}
</style>
