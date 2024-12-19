<template>
<SnippetsBackgroundBlocker @click="$emit('toggle-add-new-form')" :zIndex="20">
  <div
    id="add-new-address"
    class="
      fixed
      w-[90%]
      md:w-2/3
      lg:w-1/2
      h-auto
      max-h-[75%]
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      z-20
      overflow-auto
      bg-white
      border border-black p-4 md:p-8 max-w-xl
    "
    @click.stop
  >
    <button @click="$emit('toggle-add-new-form')" class="absolute top-4 right-4">
      <IconsCloseX />
    </button>
    <h1 class="text-extra-large text-center mb-4">Add New Address</h1>
    <ul
      v-if="errors.length > 0"
      class="errors text-red-500 text-center mb-4"
    >
      <li v-for="error in errors" :key="error.code">
        {{ error.message }}
      </li>
    </ul>
    <form
      data-address="root"
      ref="form"
      class="grid sm:grid-cols-2 gap-x-2"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col form-field">
        <span 
          v-if="v$.first_name.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.first_name.$errors[0].$message }}
        </span>
        <label for="AddressFirstName">First Name</label>
        <input
          class="default"
          :class="[v$.first_name.$error ? '!border-red-500': '']"
          type="text"
          id="AddressFirstName"
          name="address[first_name]"
          v-model="state.first_name"
        />
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.last_name.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.last_name.$errors[0].$message }}
        </span>
        <label for="AddressLastName">Last Name</label>
        <input
          class="default"
          :class="[v$.last_name.$error ? '!border-red-500': '']"
          type="text"
          id="AddressLastName"
          name="address[last_name]"
          v-model="state.last_name"
        />
      </div>

      <div class="flex flex-col form-field">
        <label for="AddressCompany">Company Name</label>
        <input
          class="default"
          type="text"
          id="AddressCompany"
          name="address[company]"
          v-model="state.company"
        />
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.address1.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.address1.$errors[0].$message }}
        </span>
        <label for="AddressAddress1">Address 1</label>
        <input
          class="default"
          :class="[v$.address1.$error ? '!border-red-500': '']"
          type="text"
          id="AddressAddress1"
          name="address[address1]"
          v-model="state.address1"
        />
      </div>

      <div class="flex flex-col form-field">
        <label for="AddressAddress2">Address 2</label>
        <input
          class="default"
          type="text"
          id="AddressAddress2"
          name="address[address2]"
          v-model="state.address2"
        />
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.city.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.city.$errors[0].$message }}
        </span>
        <label for="AddressCity">City</label>
        <input
          class="default"
          :class="[v$.city.$error ? '!border-red-500': '']"
          type="text"
          id="AddressCity"
          name="address[city]"
          v-model="state.city"
        />
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.country.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.country.$errors[0].$message }}
        </span>
        <label for="AddressCountry">Country</label>
        <select
          class="default"
          :class="[v$.country.$error ? '!border-red-500': '']"
          id="AddressCountry"
          name="address[country]"
          data-default="US"
          v-model="state.country"
        ></select>
      </div>

      <div class="flex flex-col form-field">
        <!-- <span 
          v-if="v$.province.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.province.$errors[0].$message }}
        </span> -->
        <label for="AddressProvince">Province</label>
        <select
          class="default"
          id="AddressProvince"
          name="address[province]"
          data-default="California"
          v-model="state.province"
        ></select>
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.zip.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.zip.$errors[0].$message }}
        </span>
        <label for="AddressZip">Zip Code</label>
        <input
          class="default"
          :class="[v$.zip.$error ? '!border-red-500': '']"
          type="text"
          id="AddressZip"
          name="address[zip]"
          v-model="state.zip"
          autocapitalize="characters"
        />
      </div>

      <div class="flex flex-col form-field">
        <span 
          v-if="v$.phone.$error"
          class="block errors futura-std-regular text-red-500 text-left"
        >
          {{ v$.phone.$errors[0].$message }}
        </span>
        <label for="AddressPhone">Phone</label>
        <input
          class="default"
          :class="[v$.phone.$error ? '!border-red-500': '']"
          type="tel"
          id="AddressPhone"
          name="address[phone]"
          v-model="state.phone"
        />
      </div>
      <div class="col-span-full flex flex-col form-field items-center justify-center order-1">
        <button
          type="submit"
          class="w-full sm:w-1/2 py-2 button--black order-1"
        >
          Submit
        </button>
        <button
          @click.prevent="$emit('hide-new-address-form')"
          class="w-full mt-4 sm:w-1/2 py-2 button--primary order-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</SnippetsBackgroundBlocker>  
</template>

<script setup>
import { AddressForm } from '@shopify/theme-addresses';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  helpers
} from '@vuelidate/validators';
const emit = defineEmits(['toggle-add-new-form', 'hide-new-address-form'])

const { token } = useAuth();
const errors = ref([])

const state = reactive({
  first_name: '',
  last_name: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  country: 'US',
  province: '',
  zip: '',
  phone: '',
});

const rules = {
  first_name: {
     required: helpers.withMessage(
      'First Name field cannot be empty',
      required
    ),
  },
  last_name: {
     required: helpers.withMessage(
      'Last Name field cannot be empty',
      required
    ),
  },
  address1: {
     required: helpers.withMessage(
      'Address field cannot be empty',
      required
    ),
  },
  city: {
     required: helpers.withMessage(
      'City field cannot be empty',
      required
    ),
  },
  country: {
     required: helpers.withMessage(
      'Country field cannot be empty',
      required
    ),
  },
  // province: {
  //    required: helpers.withMessage(
  //     'State field cannot be empty',
  //     required
  //   ),
  // },
  zip: {
     required: helpers.withMessage(
      'Postcode field cannot be empty',
      required
    ),
  },
  phone: {
     required: helpers.withMessage(
      'Phone field cannot be empty',
      required
    ),
  }
};

const v$ = useVuelidate(rules, state);
const form = ref();

onMounted(() => {
  AddressForm(form.value, 'en');
});

onUpdated(() => {
  console.log(state);
});

async function onSubmit() {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const query = `
    mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
      customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
        customerAddress {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  const variables = {
    address: {
      address1: state.address1,
      address2: state.address2,
      city: state.city,
      company: state.company,
      country: state.country,
      firstName: state.first_name,
      lastName: state.last_name,
      phone: state.phone,
      province: state.province,
      zip: state.zip,
    },
    customerAccessToken: token.value,
  };
  let customerAddress = null;
  let customerUserErrors = null;
  try {
    const newAddressData = await useShopify({ query, variables });
    customerAddress = newAddressData.data.customerAddress;
    customerUserErrors = newAddressData.data.customerUserErrors;
  } catch (err) {
    console.log(err);
    customerAddress = null;
    customerUserErrors = null;
  }

  if (customerUserErrors && customerUserErrors.length > 0) {
    customerUserErrors.forEach(error => {
      errors.value.push(error)
    })
  } else {
    emit('toggle-add-new-form')
  }
}
</script>
