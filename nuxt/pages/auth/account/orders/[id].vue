<template>
  <article class="account-wrapper">
    <AuthSidebar />
    <section class="account-main">
      <div class="account-main__inner">
        <section v-if="customer" class="max-w-[600px] mx-auto min-h-[60vh] pt-10 pb-10">
          <!-- <product-choose-currency-modal v-if="!currency" :show-modal="!currency" /> -->
          <div class="pb-4">
            <nuxt-link class="text-center block" :to="{ name: 'auth-account-orders' }">Back</nuxt-link>
            <h1 class="text-[2.5rem] mb-4 text-center">
              Order #{{ order.node.orderNumber }}
            </h1>
            <div>
              <ul class="text-center">
                <li>
                  Placed on:
                  <strong>
                    {{
                        new Date(order.node.processedAt)
                          .toDateString()
                          .substring(4)
                          .replaceAll(' ', ', ')
                    }}
                  </strong>
                </li>
                <li>
                  Payment Status:
                  <strong>{{
                      decodeFinancialStatus(order.node.financialStatus)
                  }}</strong>
                </li>
                <li>
                  Fulfilment Status:
                  <strong>{{
                      FULFILLMENT_STATUS[order.node.fulfillmentStatus]
                  }}</strong>
                </li>
              </ul>

              <div class="mt-10" v-if="order.node.canceledAt">
                Order Cancelled on
                {{
                    new Date(order.node.canceledAt)
                      .toDateString()
                      .substring(4)
                      .replaceAll(' ', ', ')
                }}
              </div>
              <a v-if="
                order.node.statusUrl &&
                order.node.fulfillmentStatus !== 'UNFULFILLED'
              " :href="order.node.statusUrl" class="mt-10 block underline">
                View order and tracking status
              </a>
            </div>
          </div>
          <table class="responsive-table font-XS text-left w-full">
            <thead class="text-small uppercase tracking-[1.87px] hidden md:table-header-group">
              <tr class="border-b border-solid border-opacity-20 border-black">
                <th class="md:pb-5 pb-3">Product</th>
                <th class="md:pb-5 pb-3"></th>
                <th class="md:pb-5 pb-3 hidden md:table-cell">Price</th>
                <th class="md:pb-5 pb-3">Quantity</th>
                <th class="md:pb-5 pb-3">Total</th>
              </tr>
            </thead>

            <tbody class="font-azo-regular border-b border-[#C1A894]">
              <tr v-for="lineItem in lineItems" :key="lineItem.node.title"
                class="responsive-table-row text-[15px] flex md:table-row flex-wrap border-t border-opacity-20 border-black border-solid md:border-t-0">
                <td class="pr-5 md:pr-0 py-5 w-1/3 md:w-[5.8125rem]">
                  <figure v-if="lineItem.node.variant"
                    class="w-full pt-[132%] md:pt-0 md:w-[4.5rem] md:h-[5.94rem] relative">
                    <nuxt-link :to="{
                      name: 'product-handle',
                      params: { handle: lineItem.node.variant.product.handle },
                    }">
                      <img class="w-full h-full absolute top-0 left-0 object-cover" width="92" height="121" :src="
                        lineItem.node.variant.product.featuredImage.transformedSrc
                      " :alt="lineItem.node.variant.product.featuredImage.altText" />
                    </nuxt-link>
                  </figure>
                </td>
                <td class="py-5 w-2/3 md:w-auto">
                  <div class="block mb-7">
                    <h3>
                      <nuxt-link>{{ lineItem.node.title }}</nuxt-link>
                    </h3>
                    <ul class="font-azo-light" v-if="lineItem.node.variant">
                      <li class="text-[0.675rem]" v-for="selectedOption in lineItem.node.variant
                      .selectedOptions" :key="selectedOption.name">
                        {{ selectedOption.name }}: {{ selectedOption.value }}
                      </li>
                    </ul>
                    <div v-for="fulfillment in findFulfillments(
                      lineItem.node.variant?.id
                    )" :key="fulfillment.trackingUrl" class="text-extra-small">
                      {{ fulfillment.quantity }} out of
                      {{ lineItem.node.quantity }} is fulfilled -
                      <a :href="fulfillment.trackingUrl" class="underline">track here</a>
                    </div>
                  </div>
                  <!-- {% if line_item.fulfillment %}
              <p aria-label="Additional product information">
                <span class="block font-azo-light">
                  {{ 'customer.order.fulfilled_at' | t }}:
                  {{ line_item.fulfillment.created_at | date: "%B %d, %Y" }}
                </span>
                <a
                  class="block underline font-azo-light"
                  href="{{ line_item.fulfillment.tracking_url }}"
                  target="_blank"
                  title="Track this order"
                >
                  {{ 'customer.order.track_shipment' | t }}
                </a>
              </p>
              {% endif %} -->
                </td>
                <td class="w-full md:w-auto md:py-5 py-1 flex justify-between md:table-cell">
                  <span class="block md:hidden">Price</span>
                  <span v-if="lineItem.node.variant">{{ money(lineItem.node.variant.priceV2) }}</span>
                </td>
                <td class="w-full md:w-auto md:py-5 py-1 flex justify-between md:table-cell"
                  data-label="{{ 'customer.order.quantity' | t }}">
                  <span class="block md:hidden">Quantity</span>
                  <span>
                    {{ lineItem.node.quantity }}
                  </span>
                </td>
                <td class="w-full md:w-auto md:py-5 pt-1 pb-3 flex justify-between md:table-cell"
                  data-label="{{ 'customer.order.total' | t }}">
                  <span class="block md:hidden">Total</span>
                  <span>{{ money(lineItem.node.discountedTotalPrice) }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex border-b border-[#C1A894]">
            <div class="flex-1"></div>
            <div class="md:w-1/2 w-full text-base">
              <div class="responsive-table-row font-azo-medium flex justify-between pt-7 pb-7">
                <span colspan="4" class="mdall--hide"> Subtotal </span>
                <span class="" data-label="{{ 'customer.order.subtotal' | t }}">
                  {{ money(order.node.subtotalPriceV2) }}
                </span>
              </div>

              <div v-for="discount in order.node.discountApplications.edges" :key="discount"
                class="flex justify-between font-azo-light">
                <span colspan="4" class="mdall--hide">Discount </span>
                <span class="">{{ decodeOrderDiscount(discount) }}</span>
              </div>

              <div class="flex justify-between font-azo-light">
                <span colspan="4" class="mdall--hide">Shipping</span>
                <span class="">{{
                    +order.node.totalShippingPriceV2.amount <= 0 ? 'FREE' : money(order.node.totalShippingPriceV2)
                }}</span>
              </div>

              <div v-if="+order.node.totalTaxV2.amount > 0" class="flex justify-between font-azo-light">
                <span colspan="4" class="mdall--hide">Taxes</span>
                <span class="">{{ money(order.node.totalTaxV2) }}</span>
              </div>

              <div class="font-azo-medium flex justify-between pt-7">
                <span colspan="4" class="mdall--hide pb-7"> Total </span>
                <span data-label="{{ 'customer.order.total' | t }}" class="pb-7">
                  {{ moneyWithCurrency(order.node.totalPriceV2) }}
                </span>
              </div>

              <div v-if="+order.node.totalRefundedV2.amount > 0">
                <hr />
                <div class="font-azo-medium flex justify-between">
                  <span colspan="4" class="mdall--hide pb-7"> Total refunded </span>
                  <span data-label="{{ 'customer.order.total' | t }}" class="pb-7">
                    {{ money(order.node.totalRefundedV2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap mt-7 text-base">
            <div class="w-full md:w-1/2">
              <h3 class="font-azo-medium mb-4 under font-bold">Shipping Address</h3>
              <div class="leading-[1.5] font-azo-light">
                <ul>
                  <li v-for="line in order.node.shippingAddress?.formatted" :key="line">
                    {{ line }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </article>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const { currency } = useCurrency()
const { money, moneyWithCurrency } = useUtils();
const { FULFILLMENT_STATUS, decodeFinancialStatus } = useUtils();
const route = useRoute();
const { token } = useAuth();

const orderId = atob(route.params.id);
const query = `
  query MyQuery @inContext(country: ${currency.value}){
    customer(customerAccessToken: "${token.value}") {
      orders(first: 100, reverse: true) {
        edges {
          node {
            successfulFulfillments(first: 100){
              trackingCompany
              trackingInfo {
                number
                url
              }
              fulfillmentLineItems(first:100) {
                edges {
                  node {
                    lineItem {
                      variant {
                        id
                      }
                    }
                    quantity
                  }
                }
              }
            }
            orderNumber
            id
            name
            totalPriceV2 {
              amount
              currencyCode
            }
            processedAt
            financialStatus
            fulfillmentStatus
            currencyCode
            lineItems(first: 20) {
              edges {
                node {
                  quantity
                  title
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    title
                    selectedOptions {
                      name
                      value
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                    id
                    product {
                      handle
                      featuredImage {
                        transformedSrc(maxWidth: 500)
                        height
                        width
                        altText
                      }
                    }
                  }
                }
              }
            }
            currentTotalTax {
              amount
              currencyCode
            }
            currentTotalPrice {
              amount
              currencyCode
            }
            currentTotalDuties {
              amount
              currencyCode
            }
            currentSubtotalPrice {
              amount
              currencyCode
            }
            discountApplications(first: 10) {
              edges {
                node {
                  targetSelection
                  targetType
                  allocationMethod
                  value {
                    ... on MoneyV2 {
                      __typename
                      amount
                      currencyCode
                    }
                    ... on PricingPercentageValue {
                      __typename
                      percentage
                    }
                  }
                }
              }
            }
            cancelReason
            canceledAt
            originalTotalDuties {
              amount
              currencyCode
            }
            originalTotalPrice {
              amount
              currencyCode
            }
            shippingAddress {
              formatted(withName: true, withCompany: true)
            }
            shippingDiscountAllocations {
              allocatedAmount {
                amount
                currencyCode
              }
            }
            statusUrl
            totalRefundedV2 {
              amount
              currencyCode
            }
            totalShippingPriceV2 {
              amount
              currencyCode
            }
            totalTaxV2 {
              amount
              currencyCode
            }
            subtotalPriceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const customerData = await useShopify({ query });
const customer = customerData.data.customer;
if (!customer) {
  nuxtApp.$router.push('/404');
}
const order = customer.orders.edges.find((edge) => edge.node?.id === orderId);
const successfulFulfillments = order.node.successfulFulfillments
  ? order.node.successfulFulfillments
  : [];

function findFulfillments(variantId) {
  const allFulfillments = [];
  successfulFulfillments.forEach((fulfillment) => {
    const founded = fulfillment.fulfillmentLineItems.edges.find(
      (edge) => edge.node.lineItem.variant?.id === variantId
    );
    if (founded) {
      allFulfillments.push({
        quantity: founded.node.quantity,
        trackingUrl:
          fulfillment.trackingInfo.length > 0
            ? fulfillment.trackingInfo[0].url
            : null,
      });
    }
  });
  return allFulfillments;
}

const lineItems = order.node.lineItems.edges;

function decodeOrderDiscount(discountObject) {
  switch (discountObject.node.value.__typename) {
    case 'PricingPercentageValue':
      return `-${discountObject.node.value.percentage}% off`;
    case 'MoneyV2':
      return `-${money(discountObject.node.value)}`;
  }
}

onMounted(() => {
  console.log(order, 'orderis');
  // console.log(order);
  // console.log(lineItems);
});
</script>