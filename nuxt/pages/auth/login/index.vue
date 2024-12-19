<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
  <div class="auth-form__container mx-auto futura-std-medium px-9 md:px-2 pt-10 relative">
    <ul
      v-if="authErrors.length > 0"
      class="absolute w-full top-0 errors text-red-500 text-center mb-4"
    >
      <li v-for="error in authErrors" :key="error.code">
        {{ error.modifiedError }}
      </li>
    </ul>
    <!--ul v-if="v$" class="errors text-red-500 text-center mb-4">
      <li v-for="error of v$.$errors" :key="error.$uid">
        {{ error.$message }}
      </li>
    </ul-->
    <form class="grid md:grid-cols-2 gap-x-8 gap-y-10 md:gap-y-[2.5rem]" @submit.prevent="loginToShopify">
      <div class="left-column grid gap-y-10 md:gap-y-[2.5rem]">
        <div class="auth-form__content-bock">
          <span 
            v-if="v$.email.$error"
            class="block errors futura-std-regular text-red-500 text-left mb-1"
          >
            {{ v$.email.$errors[0].$message }}
          </span>
          <input
            v-model="state.email"
            class="block w-full default mb-3"
            :class="v$.email.$errors.length > 0 ? '!border-red-600 !border' : ''"
            autocomplete="on"
            name="loginEmail"
            id="loginEmail"
          />
          <label for="loginEmail" class="block mb-10">
            Email
          </label>
          <div class="auth-form__content-bock">  
            <span 
              v-if="v$.password.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.password.$errors[0].$message }}
            </span>
            <input
              v-model="state.password"
              class="block w-full default mb-3"
              :class="
                v$.password.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              type="password"
              autocomplete="on"
              name="loginPassword"
              id="loginPassword"
            />
            <label for="loginPassword" class="block mb-10">
              <div class="flex">
              <p>Password</p> <a class="underline ml-auto text-gray-400"><nuxt-link to="/auth/reset-password">**Forgot Password?</nuxt-link></a>
              </div>
            </label>
          </div>
          <!-- <div class="auth-form__content-bock">
            <div class="flex items-start">
              <input
                id="ts-marketing"
                type="checkbox"
                :checked="state.acceptsMarketing ? 'checked' : false"
                class="block mr-2 mt-1"
                v-model="state.acceptsMarketing"
              />
              <label
                for="ts-marketing"
                class="flex-1"
              >
                Yes, I'd like to receive emails from Majesty's Pleasure about new launches, events, promos and offers.
              </label>
            </div>
          </div> -->
        </div>
      </div>
      <div class="right-column grid gap-y-10 md:gap-y-[2.5rem]">
        <div class="auth-form__content-bock">
          <button type="submit" class="button--black w-full uppercase"
              >
           LOGIN
          </button>
          <p class="text-gray-400 text-right mt-5">Not a Member?<a class="underline ml-4"><nuxt-link to="register">Register Now</nuxt-link></a></p>
        </div>
      </div>
      <!-- <button type="submit" class="button w-full">Login</button> -->
    </form>
    <!-- <div class="flex flex-col justify-center items-center mt-4">
      <nuxt-link to="/auth/reset-password">Reset Password</nuxt-link>
      <nuxt-link to="/auth/register">No account? Register</nuxt-link>
    </div> -->
  </div>
  </div>
</template>

<script setup>
import {useVuelidate} from '@vuelidate/core';

import {
  required,
  email as emailValidator,
  helpers,
  minLength,
  alphaNum,
} from '@vuelidate/validators';

const { login, isAuthenticated, token } = useAuth();

if(isAuthenticated.value)
  navigateTo('/auth/account');
  
const route = useRoute();
const router = useRouter();
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('auth/login', {
  version: version
});
const component = resolveComponent(story.value.content.component)

const authErrors = ref([]);

const state = reactive({
  email: '',
  password: ''
});

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
  password: {
    required: helpers.withMessage('Password field cannot be empty', required),
    minLength: helpers.withMessage(
      'Password field has to be at least 9 characters',
      minLength(9)
    ),
  },
};

const v$ = useVuelidate(rules, state);

async function loginToShopify() {
  const valid = await v$.value.$validate();
  authErrors.value = v$.value.$errors
  //if (!valid) return;

  const { success, errors } = await login(state.email, state.password);

  if (success) {
    navigateTo('/auth/account');
    // const query = `
    //   mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
    //     customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
    //       customer {
    //         acceptsMarketing
    //       }
    //       customerUserErrors {
    //         field
    //         code
    //         message
    //       }
    //     }
    //   }
    // `;
    
    // const variables = {
    //   customer: { acceptsMarketing : state.acceptsMarketing },
    //   customerAccessToken: token.value,
    // };

    // const { data } = await useShopify({ query, variables });
    // if (!data.errors?.length) {
    // } else if (data.errors && data.errors.length > 0) {
    //   console.log(errors)
    // }
  } else if (errors.length > 0) {
    authErrors.value = errors;
  }
}
</script>
