<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="mb-10 mx-auto px-8 lg:px-[50px] inquire-form py-[50px] form md:py-[100px]"
  >
    <header
      v-if="blok.title"
      class="mb-5 md:mb-20 md:pl-[50px]"
    >
      <h2 class="text-[2rem] leading-none saol-display-light">
        {{ blok.title }}
      </h2>
    </header>
    <div class="lg:flex justify-between">
      <fieldset class="w-full block md:px-8 lg:px-[50px] flex-1">
        <form
          method="POST"
          @submit.prevent="onSubmit($event)"
          @change="onChangeForm"
        >
          <div class="form-field flex flex-col md:mb-14">
            <span
              v-if="v$.eventName.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.eventName.$errors[0].$message }}
            </span>
            <input
              id="event-name"
              class="email-sub default"
              :class="[v$.eventName.$error ? '!border-red-500': '']"
              type="text"
              name="event_name"
              v-model="state.eventName"
            />
            <label
              for="event-name"
              class="futura-std-medium pt-4"
            >Group or Event Name</label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div class="form-field flex flex-col md:mb-14">
              <span
                v-if="v$.date.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.date.$errors[0].$message }}
              </span>
              <input
                id="date"
                class="email-sub default"
                :class="[v$.date.$error ? '!border-red-500': '']"
                type="date"
                name="date"
                v-model="state.date"
              />
              <label
                for="date"
                class="futura-std-medium pt-4"
              >Date</label>
            </div>
            <div class="form-field flex flex-col md:mb-14">
              <span
                v-if="v$.time.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.time.$errors[0].$message }}
              </span>
              <input
                id="time"
                class="email-sub default"
                :class="[v$.time.$error ? '!border-red-500': '']"
                type="time"
                name="time"
                v-model="state.time"
              />
              <label
                for="time"
                class="futura-std-medium pt-4"
              >Time</label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div class="form-field flex flex-col md:mb-14">
              <span
                v-if="v$.nameOfGroup.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.nameOfGroup.$errors[0].$message }}
              </span>
              <input
                id="number-of-groups"
                class="email-sub default"
                :class="[v$.nameOfGroup.$error ? '!border-red-500': '']"
                type="text"
                name="number_of_groups"
                v-model="state.nameOfGroup"
              />
              <label
                for="number-of-groups"
                class="futura-std-medium pt-4"
              >Number of Group</label>
            </div>
            <div class="form-field flex flex-col md:mb-14">
              <span
                v-if="v$.emailContact.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.emailContact.$errors[0].$message }}
              </span>
              <input
                id="email-contact"
                class="email-sub default"
                :class="[v$.emailContact.$error ? '!border-red-500': '']"
                type="text"
                name="email_contact"
                v-model="state.emailContact"
              />
              <label
                for="email-contact"
                class="futura-std-medium pt-4"
              >Email Contact</label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div class="form-field flex flex-col md:mb-14">
              <span
                v-if="v$.location.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.location.$errors[0].$message }}
              </span>

              <select
                name="location"
                id="location"
                class="email-sub default"
                :class="[v$.location.$error ? '!border-red-500': '']"
                v-model="state.location"
              >
                <option value="yorkville">Yorkville</option>
                <option value="kingwest">King West</option>
                <option value="flatiron">Flatiron</option>
              </select>
              <label
                for="location"
                class="futura-std-medium pt-4"
              >Location</label>
              <!-- 
              <input
                id="location"
                class="email-sub default"
                :class="[v$.location.$error ? '!border-red-500': '']"
                type="text"
                name="location"
                v-model="state.location"
              />
              <label for="location" class="futura-std-medium pt-4">Location</label> -->
            </div>
            <div class="form-field flex flex-col mb-14">
              <span
                v-if="v$.phone.$error"
                class="block errors futura-std-regular text-red-500 text-left mb-1"
              >
                {{ v$.phone.$errors[0].$message }}
              </span>
              <input
                id="phone"
                class="email-sub default"
                :class="[v$.phone.$error ? '!border-red-500': '']"
                type="number"
                name="phone"
                v-model="state.phone"
              />
              <label
                for="phone"
                class="futura-std-medium pt-4"
              >Phone #</label>
            </div>
          </div>

          <button
            ref="submitButton"
            class="button--black uppercase"
            type="submit"
            aria-label="Submit Form"
          >
            <span ref="submitText">SEND REQUEST</span>
          </button>
          <div>
            <span
              class="text-sm pt-4 block"
              ref="successMessage"
            ></span>
          </div>
        </form>
      </fieldset>
      <div
        v-if="blok.email || blok.phone || blok.follow"
        class="md:px-8 lg-down:mt-20 lg:px-[50px] flex-1 max-w-[500px] right-sidebar"
      >
        <div class="mb-6">
          <p class="text-xs leading-loose tracking-[2px] mb-6 futura-std-medium">EMAIL:</p>
          <div
            v-html="richText(blok.email)"
            class="text-[2rem] saol-display-light leading-none"
          >
          </div>
        </div>
        <div class="mb-6">
          <p class="text-xs leading-loose tracking-[2px] mb-6 futura-std-medium">PHONE:</p>
          <div
            v-html="richText(blok.phone)"
            class="text-[2rem] saol-display-light inquire-form__phone-number leading-none"
          >
          </div>
        </div>
        <div class="mb-6">
          <p class="text-xs leading-loose tracking-[2px] mb-6 futura-std-medium">FOLLOW:</p>
          <div
            v-html="richText(blok.follow)"
            class="text-[2rem] saol-display-light inquire-form__follow-links leading-none"
          >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { useVuelidate } from '@vuelidate/core';
console.log(blok.success_message)
import {
  required,
  email as emailValidator,
  helpers,
} from '@vuelidate/validators';
const { richText } = useUtils();
const submitText = ref()
const submitButton = ref()
const successMessage = ref();
const { submitFormsparkForm } = useFormspark();
const { blok } = defineProps({ blok: Object });
const state = reactive({
  eventName: '',
  date: '',
  time: '',
  nameOfGroup: '',
  emailContact: '',
  location: '',
  phone: null
});
const rules = {
  eventName: {
     required: helpers.withMessage(
      'Event name field cannot be empty',
      required
    ),
  },
  date: {
     required: helpers.withMessage(
      'Date field cannot be empty',
      required
    ),
  },
  time: {
     required: helpers.withMessage(
      'Time field cannot be empty',
      required
    ),
  },
  nameOfGroup: {
     required: helpers.withMessage(
      'Name of group field cannot be empty',
      required
    ),
  },
  emailContact: {
    emailValidator: helpers.withMessage(
      'Email address is not valid',
      emailValidator
    ),
    required: helpers.withMessage(
      'Email Contact field cannot be empty',
      required
    ),
  },
  location: {
     required: helpers.withMessage(
      'Location field cannot be empty',
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

//H802b843
const v$ = useVuelidate(rules, state);
async function onSubmit(e) {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const resp =  await submitFormsparkForm( 
    e,
    blok.form_spark_id ? blok.form_spark_id : 'H802b843',
    submitText.value,
    successMessage.value,
    blok.success_message
  );
  submitButton.value.setAttribute('disabled', 'disabled');
  return resp
}
function onChangeForm() {
  // submitText.value.textContent = "Submit"
  submitButton.value.removeAttribute('disabled');
}
</script>


<style lang="scss">
  .inquire-form {

    a {
      // text-decoration: underline;
      // text-decoration-thickness: .07em;
      // text-underline-position: below;
      @extend .fancy-underline;
      @extend .fancy-underline--has-underline;
      &:hover {
        // text-decoration: underline;
      }
    }

    select,
    input {
      min-height: toRem(50);
      border-color: #909090;
    }
    button {
      display: flex;
      height: toRem(50);
      align-items: center;
      justify-content: center;
      width: 100%;
      @screen md {
        width: toRem(308);
      }
    }
    .groups-and-events & {

      margin-bottom: 0;
      border-bottom: 1px solid black;
      @screen md {
        padding-top: toRem(140);
        padding-bottom: toRem(160);
      }
    }
    .corporate-gifting & {
      padding-top: toRem(100);
      border-top: 1px solid black;
      margin-bottom: toRem(100);
    }
    &__follow-links,
    &__phone-number {
      a {
        line-height: 1.3;
      }
    }
  }
</style>
