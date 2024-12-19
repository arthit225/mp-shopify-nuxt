import useCurrency from '../useCurrency';
const ALL_QUANTITY_IN_YOUR_CART =
  'You have all existing stock for this item already in your cart';

export default function useCart() {
  const { currency } = useCurrency();

  const cartEl = useState('cartEl', () => null);
  const cartId = useState('cartId', () => null);

  const lineItems = useState('lineItems', () => []);
  const cart = useState('cart', () => {});
  const cartCount = useState('cartCount', () => 0);
  const cartIsOpen = useState('cartIsOpen', () => false);
  const { token } = useAuth();

  function toggleMiniCart() {
    if (!cartEl.value) return;
    cartEl.value.classList.toggle('open');
    cartIsOpen.value = !cartIsOpen.value;
  }

  function openMiniCart() {
    if (!cartEl.value) return;
    cartEl.value.classList.add('open');
    cartIsOpen.value = true;
  }

  function closeMiniCart() {
    if (!cartEl.value) return;
    cartEl.value.classList.remove('open');
    cartIsOpen.value = false;
  }

  async function getCart(cartId) {
    if (!cartId) return null;
    
    cartBuyerIdentifyUpdate(cartId);

    const query = `
    query MyQuery {
      cart(id: "${cartId}") {
        totalQuantity
        checkoutUrl
        buyerIdentity {
          customer {
            id
            email
          }
        }
        id
        note
        discountCodes {
          applicable
          code
        }
        attributes {
          key
          value
        }
        estimatedCost {
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            currencyCode
            amount
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              attributes {
                key
                value
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
              sellingPlanAllocation {
                sellingPlan {
                  description
                  id
                  name
                  recurringDeliveries
                }
              }
              discountAllocations {
                ... on CartCodeDiscountAllocation {
                  __typename
                  discountedAmount {
                    amount
                    currencyCode
                  }
                  code
                }
                ... on CartAutomaticDiscountAllocation {
                  __typename
                  discountedAmount {
                    amount
                    currencyCode
                  }
                  title
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  quantityAvailable
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    featuredImage {
                      altText
                      height
                      width
                      transformedSrc(maxWidth: 300)
                    }
                    handle
                  }
                  sellingPlanAllocations (first:20) {
                    edges {
                      node {
                        sellingPlan {
                          description
                          id
                          name
                          recurringDeliveries
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    `;

    try {
      const retrievedCart = await useShopify({ query });

      return retrievedCart.data.cart;
    } catch {
      return null;
    }
  }

  async function cartBuyerIdentifyUpdate(cartId) {
     const query = `
     mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
       cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
         cart {
           id
           buyerIdentity {
             email
             phone
             countryCode
             customer {
               email
               phone
             }
           }
         }
         userErrors {
           code
           field
           message
         }
       }
     }
     `;
 
     const variables = {
       cartId: getCartId(),
       buyerIdentity: {
         customerAccessToken: token.value
       },
     };
 
          
     try {
       const response = await useShopify({ query,variables });
 
       return response;
     } catch (err) {
       console.warn(err);
       return null;
     }
     
   }

  function getCartId() {
    return `${window.localStorage.getItem('cartId')}`;
  }

  async function createCart() {
    //alert("createCart");
    const query = `
      mutation createCartMutation @inContext(country: ${currency.value}){
        cartCreate {
          cart {
            id
            checkoutUrl
            lines(first: 50) {
              edges {
                node {
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      quantityAvailable
											price {
												amount
												currencyCode
											}
                    }
                  }
                  id
                  estimatedCost {
                    subtotalAmount {
                      amount
                      currencyCode
                    }
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  attributes {
                    key
                    value
                  }
                  sellingPlanAllocation {
                    sellingPlan {
                      description
                      id
                      name
                      recurringDeliveries
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const newCart = await useShopify({ query });
      //alert(currency.value);
      //alert(JSON.stringify(newCart));
      return newCart.data.cartCreate.cart;
    } catch (err) {
      //alert(err)
      return null;
    }
  }

  async function addToCart(lineItems) {
    console.log(lineItems, 'lineItems');
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: `${getCartId()}`,
      lines: lineItems,
    };

    try {
      const response = await useShopify({ query, variables });

      if (response.userErrors) {
        alert(response.userErrors.message);
      } else {
        const newCart = await getCart(getCartId());
        if (newCart.totalQuantity === cart.value.totalQuantity) {
      //    alert(ALL_QUANTITY_IN_YOUR_CART);
        } else {
          openMiniCart();
        }
        cart.value = newCart;
      }

      return response;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async function addToCart2(lineItems, cartId) {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cartId,
      lines: lineItems,
    };

    try {
      const response = await useShopify({ query, variables });

      if (response.userErrors) {
        alert(response.userErrors.message);
      }
      return response;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async function updateLineItems(lineItems) {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: `${getCartId()}`,
      lines: lineItems,
    };

    try {
      const response = await useShopify({ query, variables });

      if (response.userErrors) {
        alert(response.userErrors.message);
      } else {
        const oldTotalQuantity = cart.value.totalQuantity;
        const newCart = await getCart(getCartId());
        cart.value = newCart;
        if (newCart.totalQuantity === oldTotalQuantity) {
          alert(ALL_QUANTITY_IN_YOUR_CART);
        }
      }

      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function removeLineItems(lineIdsArray) {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      cartId: `${getCartId()}`,
      lineIds: lineIdsArray,
    };

    try {
      const response = await useShopify({ query, variables });

      if (response.userErrors) {
        alert(response.userErrors.message);
      } else {
        const newCart = await getCart(getCartId());
        cart.value = newCart;
      }

      return response;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async function applyDiscountCode(discountCodesArray) {
    const query = `
      mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      cartId: `${getCartId()}`,
      discountCodes: discountCodesArray,
    };

    try {
      const response = await useShopify({ query, variables });

      if (response.userErrors) {
        alert(response.userErrors.message);
      } else {
        const newCart = await getCart(getCartId());
        cart.value = newCart;
      }

      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function cartAttributesUpdate(attr, givenCartId = null) {
    if (!cartId && !givenCartId) return null;

    const query = `
      mutation MyMutation($attributes: [AttributeInput!] = {key: "", value: ""}, $cartId: ID = "") {
        cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
          cart {
            attribute(key: "name") {
              key
              value
            }
          }
        }
      }
    `;

    let variables = null;
    if (givenCartId) {
      console.log('we have given cart id', attr, givenCartId);
      variables = {
        cartId: `${givenCartId}`,
        attributes: attr,
      };
    } else {
      variables = {
        cartId: `${cartId.value}`,
        attributes: attr,
      };
    }
    console.log(variables, 'variables blet');
    try {
      const retrievedCart = await useShopify({ query, variables });
      return retrievedCart;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async function cartAttributeUpdate(attr, givenCartId = null) {
    if (!cartId && !givenCartId) return null;

    const query = `
      mutation MyMutation {
        cartAttributesUpdate(attributes: {key: "${attr.key}", value: "${
      attr.value
    }"}, cartId: "${givenCartId ? givenCartId : cartId.value}") {
          cart {
            checkoutUrl
            attribute(key: "name") {
              key
              value
            }
          }
        }
      }
    `;

    try {
      const retrievedCart = await useShopify({ query });
      return retrievedCart;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async function cartNoteUpdate(note, cartId) {
    if (!cartId || note === undefined) return null;

    const query = `
      mutation MyMutation {
        cartNoteUpdate(cartId: "${cartId}", note: "${note}") {
          cart {
            id
            note
          }

          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const retrievedCart = await useShopify({ query });
      return retrievedCart.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  function destroyCart() {
    cart.value = null
    window.localStorage.removeItem("cartId");
    cartEl.value = null
    cartId.value = null
    lineItems.value = []
    cart.value = {}
    cartCount.value = 0
  }
  return {
    cartId,
    cartEl,
    cart,
    lineItems,
    cartIsOpen,
    cartCount,
    toggleMiniCart,
    closeMiniCart,
    openMiniCart,
    addToCart,
    addToCart2,
    updateLineItems,
    removeLineItems,
    applyDiscountCode,
    getCartId,
    getCart,
    createCart,
    cartAttributeUpdate,
    cartAttributesUpdate,
    cartNoteUpdate,
    destroyCart
  };
}
