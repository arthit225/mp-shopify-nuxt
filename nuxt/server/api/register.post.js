import useShopify from '~~/composables/useShopify';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const shopifyAdminApiKey = config.shopifyAdminApiAccessToken;
  const { firstName, lastName, email, password, phone, acceptsMarketing, dateOfBirth } = await useBody(
    event
  );

  if (!email)
    return {
      data: null,
      errors: [{ message: 'Please provide email address' }],
    };
  if (!password)
    return { data: null, errors: [{ message: 'Please provide password' }] };

  const [customerData, allErrors] = await createCustomer({
    firstName,
    lastName,
    email,
    password,
    phone,
    acceptsMarketing,
  });

  if (allErrors.length > 0) return { data: null, errors: allErrors };

  await updateCustomerFields(
    {
      id: customerData.id,
      metafield: {
        type: 'date',
        namespace: 'customer_info',
        key: 'date_of_birth',
        value: dateOfBirth,
      },
    },
    shopifyAdminApiKey
  );
  // `
  //   Server response returns: {
  //     data: Object: {id: String, email: String}, // an object with customer fields such as: id, email
  //     errors: [Object: {message: STRING!}] // an array of objects that contains property 'message' (human readable error message)
  //   }
  // `;

  return {
    data: customerData,
    errors: allErrors,
  };
});

async function createCustomer(formData) {
  const { firstName, lastName, email, password, phone, acceptsMarketing } = formData;
  const query1 = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }

      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

  const variables1 = {
    input: {
      acceptsMarketing: acceptsMarketing,
      email: `${email}`,
      password: `${password}`,
      firstName: `${firstName}`,
      lastName: `${lastName}`,
      phone: phone
    },
  };

  let customerData = null;
  let allErrors = [];

  try {
    const { data, errors } = await useShopify({
      query: query1,
      variables: variables1,
    });

    if (errors && errors.length > 0) {
      allErrors = errors.map((error) => {
        return { message: error.message };
      });
    } else {
      customerData = data.customerCreate.customer;
      allErrors = data.customerCreate.customerUserErrors;
    }
  } catch (err) {
    console.log(err, 'erroras... negerai');
    allErrors = [{ message: err.message }];
  }
  
  return [customerData, allErrors];
}

async function updateCustomerFields(customerDataInput, shopifyAdminApiKey) {
  console.log(customerDataInput);
  const query2 = `
  mutation updateCustomerMetafield {
    customerUpdate(
      input: {id: "${customerDataInput.id}", metafields: {key: "${customerDataInput.metafield.key}", namespace: "${customerDataInput.metafield.namespace}", type: "${customerDataInput.metafield.type}", value: "${customerDataInput.metafield.value}"}}
    ){
      customer{
        id
        metafield(key: "${customerDataInput.metafield.key}", namespace: "${customerDataInput.metafield.namespace}"){
          key
          value
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
    const request = await $fetch(
      'https://majestyspleasure.myshopify.com/admin/api/2022-04/graphql.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${shopifyAdminApiKey}`,
        },
        body: {
          query: query2,
        },
      }
    );
    console.log(JSON.stringify(request), request, 'admin api request');
  } catch (err) {
    console.error(err);
  }
}
