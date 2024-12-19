<template>
  <div>
    <component :is="component" v-if="story" :blok="story.content" />
  <section class="auth-form__container mx-auto futura-std-medium px-9 md:px-2">
    <div class="relative pt-10">
      <ul
        v-if="authErrors.length > 0"
        class="absolute w-full top-0 errors text-red-500 text-center mb-2"
      >
        <li v-for="error in authErrors" :key="error.message">
          {{ error.message }}
        </li>
      </ul>

      <!--ul class="errors text-red-500 text-center mb-2">
        <li v-for="error of v$.$errors" :key="error.$uid">
          {{ error.$message }}
        </li>
      </ul-->
      <form class="grid md:grid-cols-2 gap-x-8 gap-y-[60px]" @submit.prevent="registerAccount">
        <div class="left-column grid">
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.firstName.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.firstName.$errors[0].$message }}
            </span>
            <input
              v-model="state.firstName"
              class="block w-full default mb-4"
              :class="
                v$.firstName.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              name="loginFirstName"
              id="loginFirstName"
            />
            <label for="loginFirstName" class="block mb-10">
              First Name
            </label>
          </div>
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.lastName.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.lastName.$errors[0].$message }}
            </span>
            <input
              v-model="state.lastName"
              class="block w-full default mb-4"
              :class="
                v$.lastName.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              name="loginLastName"
              id="loginLastName"
            />
            <label for="loginLastName" class="block mb-10">
              Last Name
            </label>
          </div>
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.email.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.email.$errors[0].$message }}
            </span>
            <input
              v-model="state.email"
              class="block w-full default mb-4"
              :class="
                v$.email.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              name="loginEmail"
              id="loginEmail"
            />
            <label for="loginEmail" class="block mb-10">
              Email
            </label>
          </div>
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.password.password.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.password.password.$errors[0].$message }}
            </span>
            <input
              v-model="state.password.password"
              class="block w-full default mb-4"
              :class="
                v$.password.password.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              autocomplete="on"
              type="password"
              name="loginPassword"
              id="loginPassword"
            />
            <label for="loginPassword" class="block mb-10">
              Password
            </label>
          </div>
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.password.confirmPassword.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.password.confirmPassword.$errors[0].$message }}
            </span>
            <input
              v-model="state.password.confirmPassword"
              class="block w-full default mb-4"
              :class="
                v$.password.confirmPassword.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              autocomplete="on"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
            <label for="confirmPassword" class="block mb-10">
              Confirm Password
            </label>
          </div>
          <div class="auth-form__content-bock">
            <span 
              v-if="v$.phone.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.phone.$errors[0].$message }}
            </span>
            <input
              v-model="state.phone"
              class="block w-full default mb-4"
              :class="
                v$.phone.$errors.length > 0 ? '!border-red-600 !border' : ''
              "
              name="loginPhone"
              id="loginPhone"
            />
            <label for="loginPhone" class="block mb-10">
              Phone
            </label>
          </div>
          <div class="auth-form__content-bock">
            <div class="flex items-start">
              <input
                id="ts-marketing"
                type="checkbox"
                class="block mt-1 mr-2"
                :checked="state.acceptsMarketing ? 'checked' : false"
                v-model="state.acceptsMarketing"
              />
              <label
                for="ts-marketing"
                class="flex-1"
              >
                Yes, I'd like to receive emails from Majesty's Pleasure about new launches, events, promos and offers.
              </label>
            </div>
          </div>
        </div>
        <div class="right-column grid gap-y-10 md:gap-y-[2.5rem]">
          <div class="auth-form__content-bock">
            <button type="submit" class="button--black w-full uppercase"
                >
            Register NOW
            </button>
            <p class="text-gray-400 text-right mt-5">Already a Member?<a class="underline ml-4"><nuxt-link to="login">Sign In</nuxt-link></a></p>
          </div>
        </div>
      </form>
    </div>
  </section>
  </div>
</template>

<script setup>
import {useVuelidate} from '@vuelidate/core';
import {
  required,
  email as emailValidator,
  helpers,
  minLength,
  sameAs
} from '@vuelidate/validators';
const { register, login, isAuthenticated } = useAuth();

if(isAuthenticated.value)
  navigateTo('/auth/account');

const route = useRoute();
const router = useRouter();
const version = route.query._storyblok || route.isDev ? "draft" : "published";
const story = await useStoryblok('auth/register', {
  version: version
});
const component = resolveComponent(story.value.content.component)

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: {
    password: '',
    confirmPassword:'',
  },
  phone: '',
  acceptsMarketing: true
});

const rules = computed(() => {
  return {
    firstName: {
      required: helpers.withMessage(
        'First Name field cannot be empty',
        required
      ),
    },
    lastName: {
      required: helpers.withMessage(
        'Last Name field cannot be empty',
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
    password: {
      password: {
        required: helpers.withMessage('Password field cannot be empty', required),
        minLength: helpers.withMessage(
          'Password field has to be at least 9 characters',
          minLength(9)
        ),
      },
      confirmPassword: {
        required: helpers.withMessage('Confirm Password field cannot be empty', required),
        minLength: helpers.withMessage(
          'Password field has to be at least 9 characters',
          minLength(9)
        ),
        sameAs: sameAs(state.password.password)
      }
    },
    phone: {
      required: helpers.withMessage(
        'Phone field cannot be empty',
        required
      ),
    },
  }
});

const v$ = useVuelidate(rules, state);

const authErrors = ref([]);

async function registerAccount() {
  // console.log(state.dateOfBirth)
  const valid = await v$.value.$validate();
  authErrors.value = v$.value.$errors
  console.log('valid', valid)
  if (!valid) return;
  authErrors.value = [];

  // console.log('typeof', typeof(state.email))
  const { data, errors } = await register({
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    password: state.password.password,
    phone: state.phone,
    acceptsMarketing: state.acceptsMarketing
  });

  console.log('register result', data, errors);

  if (errors && errors.length > 0) {
    authErrors.value = errors;
  } else if (data) {
    const { success, errors } = await login(state.email, state.password.password);
    if (success) {
      navigateTo('/');
    }
  }
}
</script>
<style lang="scss">
.auth-form {
  &__container {
    max-width: toRem(778);
    margin-top: toRem(60);
    margin-bottom:toRem(100);
    @screen md {
      margin-top: toRem(160);
      margin-bottom:toRem(180);
    }
  }
  &__content-bock {
    position: relative;
    margin-top: 1.5rem;
    @screen md {
      width: toRem(334);
      margin: 0;
    }
    .errors {
      bottom: 100%;
      font-size: .75rem;
      position: absolute;
    }
  }
}
</style>