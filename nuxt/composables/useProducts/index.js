export default function useProducts() {
  const { currency } = useCurrency();
  async function getFirstVariantID(productID) {
    const query = `
      query getCollection @inContext(country: ${currency.value}){
      product(id:"${productID}") {
        title
        variants(first: 10) {
          edges {
              node {
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`;
    try {
        let productObject = await useShopify({ query });
        return productObject?.data?.product?.variants?.edges[0]?.node?.id
    } catch {
        return ''
    }
  }
  async function getProductInfo(productID) {
    const  query = `
      query getCollection @inContext(country: ${currency.value}){
      product(id:"${productID}") {
        handle
        id
        title
        availableForSale
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          src
          id
          height
          altText
          width
        }
        variants(first: 10) {
          edges {
            node {
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`;
    try {
      let productObject = await useShopify({ query });
      return productObject?.data?.product
    } catch {
      return ''
    }
  }
  async function searchProductsByFilterTags(checkedAllTagValues) {
    let tagQueryArray = []
    for (var tag in checkedAllTagValues) {
      tagQueryArray.push('(' + checkedAllTagValues[tag].map(tagVal=>`tag:filter_${tag}_${tagVal}`).join(" OR ") + ')')
    }
    const tagQuery = tagQueryArray.join(" AND ")
    console.log('tagQuery', tagQuery)
    const  query = `query getCollection @inContext(country: ${currency.value}){
      products(first: 32,query:"${tagQuery}*") {
          edges {
            node {
              handle
              id
              title
              availableForSale
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                src
                id
                height
                altText
                width
              }

              variants(first: 10) {
                edges {
                  node {
                    id
                    priceV2 {
                      amount
                      currencyCode
                    }
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
    }
  `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.products?.edges
    } catch {
      return ''
    }
  }

  async function searchProducts(searchString) {
    const  query = `query getCollection @inContext(country: ${currency.value}){
      products(first: 32,query:"title:*${searchString}*") {
          edges {
            node {
              handle
              id
              title
              availableForSale
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                src
                id
                height
                altText
                width
              }

              variants(first: 10) {
                edges {
                  node {
                    id
                    priceV2 {
                      amount
                      currencyCode
                    }
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
    }
  `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.products?.edges
    } catch {
      return ''
    }
  }



  async function filterProductsByCollection(collectionHandle, minPrice, maxPrice) {
    console.log('collectionHandle', collectionHandle, 
    'minPrice', minPrice, 'maxPrice', maxPrice)
    let price_filter_string = ''
    let filter_string = ''
    if (minPrice && maxPrice) {
      price_filter_string = `price: { min: ${minPrice}, max:${maxPrice} }`
    } else if (minPrice) {
      price_filter_string = `price: { min: ${minPrice} }`
    } else if (maxPrice) {
      price_filter_string = `price: { max: ${maxPrice} }`
    }
    
    if (price_filter_string) {
      filter_string =`filters:{${price_filter_string}}`
    }
    const query = `query getCollection @inContext(country: ${currency.value}){
      collectionByHandle(handle: "${collectionHandle}") {
        products(
          first: 32,
          sortKey: PRICE,
          reverse: true,
          ${filter_string}
        ) {
          edges {
            node {
              handle
              id
              title
              availableForSale
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                src
                id
                height
                altText
                width
              }

              variants(first: 10) {
                edges {
                  node {
                    id
                    priceV2 {
                      amount
                      currencyCode
                    }
                    quantityAvailable
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
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.collection?.products?.edges
    } catch {
      return ''
    }
  }
  async function sortProductsByCollections(
    collectionIds,
    sortKey,
    reverse,
) {
    console.log('collectionIds', collectionIds, 
    'sortKey', sortKey, 'reverse', reverse)

    const query = `query getCollections @inContext(country: ${currency.value}){
      nodes(ids: ${collectionIds}) {
        ... on Collection {
          id
          handle
          title
          products(
            first: 250,
            sortKey: ${sortKey},
            reverse: ${reverse},
            ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                id
                title
                handle
                vendor
                variants(first: 50) {
                  edges {
                    node {
                      currentlyNotInStock
                      availableForSale
                      id
                      quantityAvailable
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                featuredImage {
                  src
                  id
                  height
                  altText
                  width
                }
              }
            }
          }
        }
      }
    }
  `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject
    } catch {
      return ''
    }
  }
  async function sortAndPaginationProductsByCollection(
    collectionId,
    FilterVendor,
    sortKey,
    reverse,
    perPage, 
    pageCursor = null)
  {
    const query = `query getCollection @inContext(country: ${currency.value}){
      collection(id: "${collectionId}") {
        products(
          first: ${perPage},`
           + (sortKey ? `sortKey: ${sortKey},` : '') + 
          `reverse: ${reverse},
          filters: { productVendor: "${FilterVendor}"},
          after: ` + (pageCursor ? `"${pageCursor}"` : null) + `,
          ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              handle
              vendor
              metafields(identifiers: [
                {namespace: "custom", key: "show_sold_out_message"},
              ])
              { 
                type 
                namespace 
                key
                value
              }
              variants(first: 50) {
                edges {
                  node {
                    currentlyNotInStock
                    availableForSale
                    id
                    quantityAvailable
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                src
                id
                height
                altText
                width
              }
            }
          }
        }
      }
    }
  `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.collection?.products
    } catch {
      return ''
    }
  }
  async function getCollections(searchString) {
    const  query = `{
      collections(first: 30) {
          nodes {
            handle
            title
          }
        }
      }
    `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.collections?.nodes
    } catch {
      return ''
    }
  }

  async function getColors() {
    const  query = `{
      collections(first: 30) {
          nodes {
            handle
            title
          }
        }
      }
    `;
    try {
      let collectionObject = await useShopify({ query });
      return collectionObject?.data?.collections?.nodes
    } catch {
      return ''
    }
  }
  return {
    getFirstVariantID,
    getProductInfo,
    searchProducts,
    searchProductsByFilterTags,
    getCollections,
    filterProductsByCollection,
    sortProductsByCollections,
    sortAndPaginationProductsByCollection
  };
}
