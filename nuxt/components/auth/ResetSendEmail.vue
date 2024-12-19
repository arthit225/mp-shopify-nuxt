<template>
  <form class="max-w-[400px] mx-auto" @submit.prevent="sendResetEmail">
    <h1 class="text-[2rem] text-center mb-2">RESET PASSWORD</h1>
    <ul
      v-if="authErrors.length > 0"
      class="errors text-red-500 text-center mb-2"
    >
      <li v-for="error in authErrors" :key="error.message">
        {{ error.message }}
      </li>
    </ul>
    <div v-if="!completed" class="relative pt-4">
      <span 
        v-if="v$.email.$error"
        class="block errors futura-std-regular text-red-500 text-left mb-1
        absolute text-xs top-0
        "
      >
        {{ v$.email.$errors[0].$message }}
      </span>
      <input
        v-model="state.email"
        class="block w-full default mb-3"
        :class="v$.email.$errors.length > 0 ? '!border-red-600 !border' : ''"
        type="email"
        name="resetEmail"
        id="resetEmail"
      />
      <label for="resetEmail" class="block mb-4">
        Email
      </label>
      <!-- <button type="submit" class="button w-full">Reset Password</button> -->
      <button type="submit" class="button--black w-full uppercase">
           Reset Password
      </button>
    </div>
    <div v-else>
      <p class="text-center mt-4 text-green-700 py-4">
        Please check <strong>{{ state.email }}</strong> for reset URL
      </p>
    </div>
  </form>
</template>

<script setup>
import {useVuelidate} from '@vuelidate/core';
import {
  required,
  email as emailValidator,
  helpers,
} from '@vuelidate/validators';

// Form data
const state = reactive({
  email: '',
});

// Form Validation Rules
const rules = {
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
};

const v$ = useVuelidate(rules, state);

const authErrors = ref([]);
const completed = ref(false);

async function sendResetEmail() {
  const valid = await v$.value.$validate();
  if (!valid) return;

  const query = `
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            message
            code
          }
        }
      }
    `;

  const variables = {
    email: state.email,
  };

  let { data, errors } = await useShopify({ query, variables });
  if (data.customerRecover) {
    errors = data.customerRecover.customerUserErrors;

  }

  if (errors) {

    authErrors.value = errors;
    if(authErrors.value.length > 0)
      return
  }

  completed.value = true;
}
</script>
