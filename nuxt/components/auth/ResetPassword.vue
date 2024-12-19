<template>
  <div class="max-w-[400px] mx-auto">
    <form class="" @submit.prevent="resetPassword">
      <h1 class="text-[2rem] text-center mb-6">RESET PASSWORD</h1>
      <ul
        v-if="authErrors.length > 0"
        class="errors text-red-500 text-center mb-4"
      >
        <li v-for="error in authErrors" :key="error.message">
          {{ error.message }}
        </li>
      </ul>
      <ul v-if="resetSuccess">
        <li class="errors text-green-500 text-center mb-4">
          You have successfully reset your password. Please
          <nuxt-link class="underline" to="/auth/login">login</nuxt-link>
        </li>
      </ul>
      <div v-if="!completed">
        <div class="relative mt-6">
          <span 
            v-if="v$.password1.$error"
            class="block errors futura-std-regular text-red-500 text-left mb-1
              absolute bottom-full text-xs
            "
          >
            {{ v$.password1.$errors[0].$message }}
          </span>
          <input
            v-model="state.password1"
            class="block w-full default mb-3"
            :class="
              v$.password1.$errors.length > 0 ? '!border-red-600 !border' : ''
            "
            type="password"
            name="password1"
            id="password1"
          />
          <label for="password1" class="block mb-4">
            New Password
          </label>
        </div>
        <div class="relative mt-6">
          <span 
            v-if="v$.password2.$error"
            class="block errors futura-std-regular text-red-500 text-left mb-1
              absolute bottom-full text-xs
            "
          >
            {{ v$.password2.$errors[0].$message }}
          </span>
          <input
            v-model="state.password2"
            class="block w-full default mb-3"
            :class="
              v$.password2.$errors.length > 0 ? '!border-red-600 !border' : ''
            "
            type="password"
            name="password2"
            id="password2"
          />
          <label for="password2" class="block mb-4">
            Repeat New Password
          </label>
        </div>

        <button type="submit" class="button--black w-full uppercase">
          Reset Password
        </button>
      </div>
      <div v-else>
        <p class="text-center mt-4 text-green-700 py-10">
          Please check <strong>{{ email }}</strong> for reset URL
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import {useVuelidate} from '@vuelidate/core';
import { required, helpers, minLength, sameAs } from '@vuelidate/validators';

// Form data
const state = reactive({
  password1: '',
  password2: '',
});

function samePassword(value) {
  if (value === state.password1) return true;
  return false;
}
// Form Validation Rules
const rules = computed(() => {
  return {
    password1: {
      required: helpers.withMessage('Password field cannot be empty', required),
      minLength: helpers.withMessage(
        'This field should be at least 9 characters long',
        minLength(9)
      ),
    },
    password2: {
      sameAs: helpers.withMessage(
        'Passwords are not matching',
        sameAs(state.password1)
      ),
    },
  }
});
const v$ = useVuelidate(rules, state);

const authErrors = ref([]);
const resetSuccess = ref(false);
const completed = ref(false);

const route = useRoute();
const resetUrl = route.query.resetUrl;

async function resetPassword() {
  const valid = await v$.value.$validate();
  if (!valid) return;

  const query = `
      mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
        customerResetByUrl(password: $password, resetUrl: $resetUrl) {
          customer {
            id
            email
          }
          customerUserErrors {
            message
            code
          }
        }
      }
    `;

  const variables = {
    password: state.password1,
    resetUrl: resetUrl,
  };

  let { data, errors } = await useShopify({ query, variables });

  if (data.customerResetByUrl) {
    errors = data.customerResetByUrl.customerUserErrors;
  }

  if (errors) {
    authErrors.value = errors;
  }

  if (
    authErrors.value.length === 0 &&
    data.customerResetByUrl.customer &&
    data.customerResetByUrl.customer.id
  ) {
    resetSuccess.value = true;
  }
}
</script>
