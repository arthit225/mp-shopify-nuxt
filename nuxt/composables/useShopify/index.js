import { reactive } from 'vue';

export default async function useShopify({ query, variables = {} }) {
  const config = useRuntimeConfig();
  const shopifyToken = config.public.shopifyStorefrontAccessToken;
  const shopifyStorefrontApiEndpoint = config.public.shopifyStorefrontApiEndpoint;
  const dataResponse = reactive({})

  dataResponse.refresh = async() => {
    try {
      const request = await $fetch(
        `${shopifyStorefrontApiEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': `${shopifyToken}`,
          },
          body: {
            query,
            variables,
          },
        }
      );
  
      console.log('useShopify request', request);
      dataResponse.data = request.data;
      dataResponse.errors = request.errors; // usually admin error, not user created
  
      return dataResponse;
    } catch (err) {
      console.error(err);
      dataResponse.data = null
      dataResponse.errors = [{ message: err.message }]
      return dataResponse;
    }
  }

  try {
    const request = await $fetch(
      `${shopifyStorefrontApiEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': `${shopifyToken}`,
        },
        body: {
          query,
          variables,
        },
      }
    );

    console.log('useShopify request', request);
    dataResponse.data = request.data;
    dataResponse.errors = request.errors; // usually admin error, not user created

    return dataResponse;
  } catch (err) {
    console.error(err);
    dataResponse.data = null
    dataResponse.errors = [{ message: err.message }]
    return dataResponse;
  }

}
