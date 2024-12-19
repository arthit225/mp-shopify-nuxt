<template>
  <article class="account-wrapper">
    <AuthSidebar />
    <section class="account-main">
      <div class="account-main__inner">
        
        <h2 class="heading-m mb-8 text-center">Account Information</h2>
        
        <!-- <AuthUploadAvatar :img-src="customer.metafield ? customer.metafield.reference.image.originalSrc : null" /> -->
        
        <div class="text-left mb-4">
          <div class="flex justify-between items-center">
            <h1 class="text-extra-large mb-2">Personal Information</h1>
            <button @click="showEditAccountForm = !showEditAccountForm" class="default underline">
              Edit Personal Information
            </button>
          </div>
          <AuthEditAccountForm v-if="showEditAccountForm" @toggle-form="showEditAccountForm = !showEditAccountForm"
            @update-personal-data="updatePersonalData" :form-data="customer" />
          <div>
            First Name: {{ customer.firstName ? customer.firstName : '---' }}
          </div>
          <div>
            Last Name: {{ customer.lastName ? customer.lastName : '---' }}
          </div>
          <div>Email address: {{ customer.email ? customer.email : '---' }}</div>
          <div>Phone number: {{ customer.phone ? customer.phone : '---' }}</div>
        </div>
        <div class="mb-14">
          <div class="flex justify-between items-center">
            <h1 class="text-extra-large mb-2">Default Address</h1>
            <nuxt-link :to="{ name: 'auth-account-addresses' }" class="underline">View All Addresses ({{ totalAddresses
            }})</nuxt-link>
          </div>
          <p v-if="customer.defaultAddress" class="whitespace-pre-line flex flex-col">
            <span v-for="row in customer.defaultAddress.formatted" :key="row">{{
                row
            }}</span>
          </p>
          <p v-else>There is currently no address existing in your profile.</p>
        </div>
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <h1 class="text-extra-large mb-2">Most recent orders</h1>
            <nuxt-link class="underline" :to="{ name: 'auth-account-orders' }">View All Orders</nuxt-link>
          </div>
          <table v-if="customer.orders.edges.length > 0" class="w-full">
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
                <td>
                  {{ FULFILLMENT_STATUS[order.node.fulfillmentStatus] }}
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else>You have no orders made yet.</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const { decodeFinancialStatus, FULFILLMENT_STATUS } = useUtils();
const { token } = useAuth();

const query = `
  query MyQuery {
    customer(customerAccessToken: "${token.value}") {
      email
      firstName
      lastName
      phone
      id
      defaultAddress {
        formatted(withName: true, withCompany: false)
      }
      addresses(first: 100) {
        edges {
          node {
            id
          }
        }
      }
      metafield(namespace: "customer_info", key: "avatar"){
        key
        value
        reference {
          ... on MediaImage {
            image {
              originalSrc
            }
          }
        }
      }
      orders(first: 5, reverse: true) {
        edges {
          node {
            orderNumber
            name
            totalPriceV2 {
              amount
              currencyCode
            }
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

const totalAddresses = computed(() => {
  return customer.addresses.edges.length;
});

const showEditAccountForm = ref(false);

function updatePersonalData(state) {
  customer.firstName = state.firstName;
  customer.lastName = state.lastName;
  customer.email = state.email;
  customer.phone = state.phone;
  showEditAccountForm.value = false;
}
</script>



<style lang="scss">
.account-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem 1rem;
  @screen md {
    margin: 5rem 2.25rem;
  }
  td,
  th {
    border: 1px solid #f7f7f7;
    text-align: left;
    padding: 1rem;
  }

  tr:nth-child(even) {
    background-color: #f7f7f7;
  }
}

.account-sidebar {
  margin-bottom: auto;
  display: flex;
  width: 100%;
  @screen md-down {
    white-space: nowrap;
    overflow-x: auto;
  }

  @screen md {
    position: sticky;
    top: 100px;
    padding-bottom: 4rem;
    width: toRem(200);
    margin: 2.25rem 0 auto 0;
    flex-direction: column;
    white-space: normal;
    overflow-x: none;
  }

  &__link {
    margin-right: 1rem;
    @screen md {
      margin-right: 0;
    }
  }

}

.account-main {
  width: 100%;
  min-height: 50vh;
  padding-top: 2.25rem;

  @screen md {
    margin-right: toRem(200);
    flex: 1;
  }

  &__inner {
    margin: 0 auto;
    @screen md {
      max-width: toRem(640);
    }
  }
}
</style>