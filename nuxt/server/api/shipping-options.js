import useShopify from '~~/composables/useShopify';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const shopifyAdminApiKey = config.shopifyAdminApiAccessToken;
  const shopifyAdminApiUrl = config.shopifyAdminApiUrl;
  const { cartId } = await useBody(event);
  if (!cartId) {
    return {
      success: false,
      data: null,
      error: 'MISSING_CART_ID',
    };
  }

  const getCartQuery = `
    query getCart {
      cart(id: "${cartId}") {
        attributes {
          key
          value
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  let cart = null

  try {
    const { data, errors } = await useShopify({
      query: getCartQuery
    });
    cart = data
    console.log(data, errors)
  } catch (err) {
    cart = null
    console.log(err)
  }

  if(!cart) {
    return {
      success: false,
      data: null,
      error: 'CART_RETRIEVE_ERROR'
    }
  }

  const shipping = JSON.parse(cart.cart.attributes.find(attr => {
    if(attr.key === 'shipping_address') return true;
    return false
  }).value)

  const lineItems = cart.cart.lines.edges.map(edge => {
    return {
      quantity: edge.node.quantity,
      variantId: edge.node.merchandise.id
    }
  })

  return {
    input: {
      lineItems: lineItems,
      shippingAddress: {
        address: shipping.address1,
        address2: shipping.address2,
        city: shipping.city,
        company: shipping.company,
        country: shipping.country,
        firstName: shipping.first_name,
        lastName: shipping.last_name,
        phone: shipping.phone,
        province: shipping.state,
        zip: shipping.zip
      },
    },
  }

  try {
    const results = await retrieveShippingOptions(
      {
        input: {
          lineItems: lineItems,
          shippingAddress: {
            address1: shipping.address1,
            address2: shipping.address2,
            city: shipping.city,
            company: shipping.company,
            country: shipping.country,
            firstName: shipping.first_name,
            lastName: shipping.last_name,
            phone: shipping.phone,
            province: shipping.province,
            zip: shipping.zip
          },
        },
      },
      shopifyAdminApiKey,
      shopifyAdminApiUrl
    );
    return {
      success: true,
      data: results,
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
});

async function retrieveShippingOptions(
  cartInput,
  shopifyAdminApiKey,
  shopifyAdminApiUrl
) {
  const query = `
    mutation draftOrderCalculate($input: DraftOrderInput!) {
      draftOrderCalculate(input: $input) {
        calculatedDraftOrder {
          availableShippingRates {
            handle
            price {
              amount
              currencyCode
            }
            title
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const request = await $fetch(shopifyAdminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': `${shopifyAdminApiKey}`,
      },
      body: {
        query: query,
        variables: cartInput,
      },
    });
    console.log(JSON.stringify(request), request, 'admin api request');
    return request;
  } catch (err) {
    console.error(err);
    return err;
  }
}
