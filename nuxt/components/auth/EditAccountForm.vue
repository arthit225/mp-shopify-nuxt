<template>
  <SnippetsBackgroundBlocker @click="$emit('toggle-form')" :zIndex="20">
    <div
      @click.stop
      class="fixed
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
        border border-black p-4 md:p-8 max-w-xl"
    >
      <button @click="emit('toggle-form')" class="absolute top-4 right-4">
        <IconsCloseX />
      </button>
      <div>
        <h1 class="text-extra-large text-center mb-4">
          Update Personal Information
        </h1>
        <form @submit.prevent="onSubmit"
          class="max-w-sm mx-auto">
          <ul
            v-if="errors.length > 0"
            class="errors text-red-500 text-center mb-4"
          >
            <li v-for="error in errors" :key="error.code">
              {{ error.message }}
            </li>
          </ul>
          <div class="form-field flex flex-col mb-6 gap-1">
            <label class="w-1/3 max-w-[140px]" for="firstName">First name:</label>
            <span 
              v-if="v$.firstName.$error"
              class="block errors futura-std-regular text-red-500 text-left"
            >
              {{ v$.firstName.$errors[0].$message }}
            </span>
            <input
              class="default flex-1"
              :class="[v$.firstName.$error ? '!border-red-500' : '']"
              type="text"
              id="firstName"
              name="firstName"
              v-model="state.firstName"
            />
          </div>
          <div class="form-field flex flex-col mb-6 gap-1">
            <label class="w-1/3 max-w-[140px]" for="lastName">Last name:</label>
            <span 
              v-if="v$.lastName.$error"
              class="block errors futura-std-regular text-red-500 text-left"
            >
              {{ v$.lastName.$errors[0].$message }}
            </span>
            <input
              class="default flex-1"
              :class="[v$.lastName.$error ? '!border-red-500' : '']"
              type="text"
              id="lastName"
              name="lastName"
              v-model="state.lastName"
            />
          </div>
          <div class="form-field flex flex-col mb-6 gap-1">
            <label class="w-1/3 max-w-[140px]" for="email">Email Address:</label>
            <span 
              v-if="v$.email.$error"
              class="block errors futura-std-regular text-red-500 text-left"
            >
              {{ v$.email.$errors[0].$message }}
            </span>
            <input 
              class="default flex-1"
              :class="[v$.email.$error ? '!border-red-500' : '']"
              type="email"
              id="email"
              name="email"
              v-model="state.email" 
            />
          </div>
          <div class="form-field flex flex-col mb-6 gap-1">
            <label class="w-1/3 max-w-[140px]" for="phone">Phone number:</label>
            <span 
              v-if="v$.phone.$error"
              class="block errors futura-std-regular text-red-500 text-left"
            >
              {{ v$.phone.$errors[0].$message }}
            </span>
            <input
              class="default flex-1"
              :class="[v$.phone.$error ? '!border-red-500' : '']"
              type="tel"
              id="phone"
              name="phone"
              placeholder="Example: +16135551111"
              v-model="state.phone"
            />
          </div>
          <button type="submit" class="button button--black mx-auto">Update</button>
        </form>
      </div>
    </div>
  </SnippetsBackgroundBlocker>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';

import {
  required,
  email as emailValidator,
  helpers,
} from '@vuelidate/validators';

const { token } = useAuth();
const emit = defineEmits(['toggle-form', 'update-personal-data']);
const { formData } = defineProps({ formData: Object });
const errors = ref([]);

const state = reactive({
  firstName: formData.firstName ? formData.firstName : '',
  lastName: formData.lastName ? formData.lastName : '',
  email: formData.email ? formData.email : '',
  phone: formData.phone ? formData.phone : null,
});

const rules = {
  firstName: {
     required: helpers.withMessage(
      'First Name field cannot be empty',
      required
    ),
  },
  lastName: {
     required: helpers.withMessage(
      'last Name field cannot be empty',
      required
    ),
  },
  email: {
    emailValidator: helpers.withMessage(
      'Email address is not valid',
      emailValidator
    ),
    required: helpers.withMessage(
      'Email address field cannot be empty',
      required
    ),
  },
  phone: {
     required: helpers.withMessage(
      'Phone field cannot be empty',
      required
    ),
  },
};

const v$ = useVuelidate(rules, state);

async function onSubmit(){
  const valid = await v$.value.$validate();
  if (!valid) return;

  const query = `
    mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
      customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
        customer {
          email
          firstName
          lastName
          phone
        }
        customerUserErrors {
          field
          code
          message
        }
      }
    }
  `;

  const variables = {
    customer: {},
    customerAccessToken: token.value,
  };

  if (state.firstName !== formData.firstName) {
    variables.customer.firstName = state.firstName;
  }

  if (state.lastName !== formData.lastName) {
    variables.customer.lastName = state.lastName;
  }

  if (state.email !== formData.email) {
    variables.customer.email = state.email;
  }

  if(state.phone === ''){
    variables.customer.phone = null
  } else if(state.phone !== formData.phone){
    variables.customer.phone = state.phone.startsWith("+") ? state.phone : "+1"+state.phone
    
  }
  console.log('variables.customer.phone', variables.customer.phone)
  let customerData = null;
  let customerUserErrors = null;
  try {
    const customerUpdatedData = await useShopify({ query, variables });
    customerData = customerUpdatedData.data.customerUpdate.customer;
    customerUserErrors = customerUpdatedData.data.customerUpdate.customerUserErrors;
  } catch (err) {
    console.log(err);
    customerData = null;
    customerUserErrors = null;
  }

  if (customerUserErrors && customerUserErrors.length > 0) {
    errors.value = []
    customerUserErrors.forEach(error => {
      errors.value.push(error)
    })
  } else {
    emit('update-personal-data', state)
  }
}
</script>
