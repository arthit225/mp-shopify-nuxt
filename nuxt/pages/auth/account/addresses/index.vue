<template>
  <article class="account-wrapper">
    <AuthSidebar />
    <section class="account-main">
      <div class="account-main__inner">

        <h2 class="heading-m mb-8 text-center">All addresses</h2>
        
        <div v-if="customerData" class="mb-14">
          <ul v-if="errors.length > 0" class="errors text-red-500 text-center mb-4">
            <li v-for="error in errors" :key="error.code">
              {{ error.message }}
            </li>
          </ul>
          <button @click="showAddNewAddress = !showAddNewAddress"
            class="button button--primary uppercase mx-auto text-center block mb-4">
            Add New Address
          </button>

          <AuthAddNewAddress
            v-if="showAddNewAddress"
            @toggle-add-new-form="handleNewAddress"
            @hide-new-address-form="showAddNewAddress = !showAddNewAddress" />
         
          <AuthEditAddress
            v-if="showEditAddress"
            @toggle-edit-form="showEditAddress = !showEditAddress"
            @edit-address-completed="handleEditAddress"            
            :form-data="editData" />
          
          <div class="flex flex-wrap pt-10 text-center md:text-left">
            <div
              v-for="address in customerData.data.customer.addresses.edges" :key="address.id"
              class="w-full md:w-1/2 mb-8"
              :class="
              address.node.id === customerData.data.customer.defaultAddress.id
                ? 'order-1'
                : 'pt-10 order-2'
            ">
              <h2 v-if="
                address.node.id === customerData.data.customer.defaultAddress.id
              " class="font-bold mb-4">
                Default address
              </h2>
              <p class="whitespace-pre-line flex flex-col">
                <span v-for="row in address.node.formatted" :key="row">{{
                    row
                }}</span>
              </p>
              <div class="flex pt-2 justify-center md:justify-start">
                <button @click="triggerEditData(address.node.id)" class="mr-4 slug-xs uppercase fancy-underline">
                  Edit
                </button>
                <button @click="deleteAddress(address.node.id)" class="slug-xs uppercase fancy-underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
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

const errors = ref([]);

const query = `
  query MyQuery {
    customer(customerAccessToken: "${token.value}") {
      defaultAddress {
        id
      }
      addresses(first: 100) {
        edges {
          node {
            firstName
            lastName
            company
            phone
            id
            address1
            address2
            city
            countryCodeV2
            provinceCode
            zip
            formatted(withName: true, withCompany: true)
          }
        }
      }
    }
  }
`;
let customerData = await useShopify({ query });

const showAddNewAddress = ref(false);
async function handleNewAddress() {
  showAddNewAddress.value = !showAddNewAddress.value;
  customerData.refresh();
}
async function deleteAddress(addressId) {
  if (!confirm('Are you sure you want to delete this address?')) return;

  const query = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        customerUserErrors {
          code
          field
          message
        }
        deletedCustomerAddressId
      }
    }
  `;

  const variables = {
    customerAccessToken: token.value,
    id: addressId,
  };

  let deleteCustomerAddressId = null;
  let customerUserErrors = null;
  try {
    const deletedAddressData = await useShopify({ query, variables });
    deleteCustomerAddressId = deletedAddressData.data.deleteCustomerAddressId;
    customerUserErrors = deletedAddressData.data.customerUserErrors;
  } catch (err) {
    console.log(err);
    deleteCustomerAddressId = null;
    customerUserErrors = null;
  }

  if (customerUserErrors && customerUserErrors.length > 0) {
    customerUserErrors.forEach((error) => {
      errors.value.push(error);
    });
  } else {
    customerData.refresh();
  }
}

onMounted(() => {
  console.log(customerData);
});

const showEditAddress = ref(false);

const watcher = watch(showEditAddress, () => {
  scrollTo({ top: 0, behavior: 'smooth' });
});

const editData = ref({});
function triggerEditData(addressId) {
  showEditAddress.value = !showEditAddress.value;
  editData.value = customerData.data.customer.addresses.edges.find((edge) => {
    if (edge.node.id === addressId) {
      return true;
    }
    return false;
  });
}

function handleEditAddress() {
  showEditAddress.value = false;
  editData.value = {};
  customerData.refresh();
}
</script>

