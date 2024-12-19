<template>
  <div
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="subscribe mx-auto text-center"
    :class="isInFooter?'':'max-w-[500px]'"
  >
    <h2
      v-if="!isInFooter"
      class="
        saol-display-light-italic
        text-[2.688rem]
        md:text-[3.25rem] md:leading-[160%]
      "
    >
      {{ blok.title }}
    </h2>
    <fieldset>
      <p class="text-medium leading-[150%] futura-std-regular">
        {{ blok.description }}
      </p>
      <form
        v-if="!state.subscribeMessage"
        @submit.prevent="klaviyoSubmit"
        class="relative"
      >
        <ul
          v-if="klErrors.length > 0"
          class="errors text-red-500 text-center absolute top-0"
        >
          <li v-for="error in klErrors" :key="error.code">
            {{ error.modifiedError }}
          </li>
        </ul>
        <!--ul v-if="v$" class="errors text-red-500 text-center mb-4 ">
          <li v-for="error of v$.$errors" :key="error.$uid">
            {{ error.$message }}
          </li>
        </ul-->
        <div class="relative pt-4">
          <span
            v-if="v$.email.$error"
            class="
              block
              errors
              futura-std-regular
              text-red-500 text-left
              mb-1
              absolute
              top-0
              text-xs
            "
          >
            {{ v$.email.$errors[0].$message }}
          </span>
          <div class="flex mb-2">
            <input
              v-model="state.email"
              class="default w-full"
              :class="
                v$.email.$errors.length > 0
                  ? '!border-red-600 !border'
                  : ''
              "
              autocomplete="on"
              placeholder="Your Email"
            />
            <input v-model="state.listID" type="hidden" name="listID" />
            <button type="submit" class="button--black">
              {{
                blok.button_text
              }}
            </button>
          </div>
        </div>
        <div class="relative pt-4">
          <span
            v-if="v$.agree.$error"
            class="
              block
              errors
              futura-std-regular
              text-red-500 text-left
              mb-1
              absolute
              top-0
              text-xs
            "
          >
            {{ v$.agree.$errors[0].$message }}
          </span>
          <div class="flex items-center">
            <label for="footer-agree" class="sr-only">
              Footer Agree
            </label>
            <input
              id="footer-agree"
              type="checkbox"
              class="block mr-2"
              :checked="true"
              :class="
                v$.agree.$errors.length > 0
                  ? '!border-red-600 !border'
                  : ''
              "
              v-model="state.agree"
            />
            <div
              class="
                flex-1
                futura-std-regular
                text-xs text-mp-color-text-secondary
                leading-[1]
                text-left
                pt-[0.1875rem]
              "
              v-html="
                richText(
                  blok.agree_text
                )
              "
            />
          </div>
        </div>
      </form>
      <div v-else class="text-gray-600 pt-8">
        {{ state.subscribeMessage }}
      </div>
    </fieldset>
  </div>
</template>
<script setup>
const { blok, isInFooter } = defineProps({ blok: Object, isInFooter: Boolean });
const { richText } = useUtils();
import { useVuelidate } from "@vuelidate/core";

import {
  required,
  email as emailValidator,
  helpers,
} from "@vuelidate/validators";
const state = reactive({
  email: "",
  listID: "UB4t6B",
  subscribeMessage: null,
  loading: false,
  agree: "",
});

const rules = {
  email: {
    emailValidator: helpers.withMessage(
      "Email address is not valid",
      emailValidator
    ),
    required: helpers.withMessage(
      "Email address field cannot be empty",
      required
    ),
  },
  agree: {
    required: helpers.withMessage(
      "Please agree on Terms of Service and Privacy Policy",
      required
    ),
  },
};

const klErrors = ref([]);

const v$ = useVuelidate(rules, state);

async function klaviyoSubmit() {
  if (state.loading) {
    return;
  }

  state.loading = true;
  const valid = await v$.value.$validate();
  console.log("valid", valid);
  if (!valid) {
    state.loading = false;
    return;
  }

  const { success, message } = await klaviyoNewsletter(
    state.email,
    state.listID
  );

  state.subscribeMessage = message;
  state.loading = false;
}

async function klaviyoNewsletter(email, listID) {
  try {
    const { success, message } = await $fetch("/api/subscribe", {
      method: "POST",
      body: {
        email,
        listID,
      },
    });
    return {
      success,
      message,
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}
</script>