<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="contact-form max-w-[800px] mx-auto px-4"
  >
    <div class="max-w-[700px]">
      <h2
        class="text-[2rem] saol-display-light leading-none mb-[55px]"
        v-html="blok.heading"
      />
      <div
        v-html="richText(blok.description)"
        class="text-xs leading-[16px] mb-[55px] font-light futura-std-medium"
      />
    </div>
    <fieldset class="w-full block flex-1 text-center">
      <form
        method="POST"
        @submit.prevent="onSubmit($event)"
        @change="onChangeForm"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-[50px]">
          <div
            v-if="!blok.hide_fields?.includes('first_name')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.firstName.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.firstName.$errors[0].$message }}
            </span>
            <input
              id="first-name"
              class="border py-[10px] px-[8px]"
              :class="[v$.firstName.$error ? 'border-red-500' : 'border-[#909090]']"
              type="text"
              name="firstName"
              placeholder="First Name"
              v-model="state.firstName"
            />
            <label
              for="firstName"
              class="text-left pt-2"
            >First Name</label>
          </div>
          <div
            v-if="!blok.hide_fields?.includes('lastt_name')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.lastName.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.lastName.$errors[0].$message }}
            </span>
            <input
              id="last-name"
              class="border py-[10px] px-[8px]"
              :class="[v$.lastName.$error ? 'border-red-500' : 'border-[#909090]']"
              type="text"
              name="lastName"
              placeholder="Last Name"
              v-model="state.lastName"
            />
            <label
              for="time"
              class="text-left pt-2"
            >Last Name</label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div
            v-if="!blok.hide_fields?.includes('email')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.emailContact.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.emailContact.$errors[0].$message }}
            </span>
            <input
              id="email-contact"
              class="border py-[10px] px-[8px]"
              :class="[v$.emailContact.$error ? 'border-red-500' : 'border-[#909090]']"
              type="text"
              name="email"
              placeholder="Email"
              v-model="state.emailContact"
            />
            <label
              for="email-contact"
              class="text-left pt-2"
            >Email</label>
          </div>
          <div
            v-if="!blok.hide_fields?.includes('phone')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.phone.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.phone.$errors[0].$message }}
            </span>
            <input
              id="phone"
              class="border py-[10px] px-[8px]"
              :class="[v$.phone.$error ? 'border-red-500' : 'border-[#909090]']"
              type="phone"
              name="phone"
              placeholder="Phone Number"
              v-model="state.phone"
            />
            <label
              for="phone"
              class="text-left pt-2"
            >Phone Number</label>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div
            v-if="!blok.hide_fields?.includes('est_guests')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.amountOfGuest.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.amountOfGuest.$errors[0].$message }}
            </span>
            <input
              id="amount-of-guests"
              class="border py-[10px] px-[8px]"
              :class="[v$.amountOfGuest.$error ? 'border-red-500' : 'border-[#909090]']"
              type="number"
              name="amount_of_guests"
              placeholder="EST. Amount of guests"
              v-model="state.amountOfGuest"
            />
            <label
              for="amount_of_guests"
              class="text-left pt-2"
            >EST. Amount of guests</label>
          </div>
        </div>
        <div
          v-if="!blok.hide_fields?.includes('message')"
          class="flex flex-col form-field mb-4 sm:mb-14"
        >
          <span
            v-if="v$.message.$error"
            class="block errors futura-std-regular text-red-500 text-left mb-1"
          >
            {{ v$.message.$errors[0].$message }}
          </span>
          <label
            for="message"
            class="text-left pt-2"
          >Message</label>
          <textarea
            class="min-h-[169px] border px-5 py-[18px]"
            :class="[v$.message.$error ? 'border-red-500' : 'border-[#909090]']"
            placeholder="Write your message here..."
            name="message"
            v-model="state.message"
          ></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 ">
          <div
            v-if="!blok.hide_fields?.includes('desired_date') "
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.date.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.date.$errors[0].$message }}
            </span>
            <input
              id="date"
              onfocus="(this.type='date')"
              onblur="if(this.value==''){this.type='text'}"
              class="border py-[10px] px-[8px]"
              :class="[v$.date.$error ? 'border-red-500' : 'border-[#909090]']"
              name="date"
              placeholder="Desired Date"
              v-model="state.date"
            />
            <label
              for="date"
              class="text-left pt-2"
            >Desire date</label>
          </div>
          <div
            v-if="!blok.hide_fields?.includes('desired_time')"
            class="flex flex-col form-field mb-4 sm:mb-14"
          >
            <span
              v-if="v$.time.$error"
              class="block errors futura-std-regular text-red-500 text-left mb-1"
            >
              {{ v$.time.$errors[0].$message }}
            </span>
            <input
              id="time"
              onfocus="(this.type='time')"
              onblur="if(this.value==''){this.type='text'}"
              class="border py-[10px] px-[8px]"
              :class="[v$.time.$error ? 'border-red-500' : 'border-[#909090]']"
              name="time"
              placeholder="Desired Time"
              v-model="state.time"
            />
            <label
              for="time"
              class="text-left pt-2"
            >Desire time</label>
          </div>
        </div>
        <button
          ref="submitButton"
          class="button--black uppercase mx-auto w-full sm:w-[334px] h-[47px]"
          type="submit"
          aria-label="Submit Form"
        >
          <span ref="submitText">Submit</span>
        </button>
        <div class="mt-4">
          <span ref="successMessage"></span>
        </div>
      </form>
    </fieldset>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email as emailValidator,
  helpers,
} from '@vuelidate/validators';
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
const submitText = ref()
const submitButton = ref()
const successMessage = ref();
const { submitFormsparkForm } = useFormspark();
const state = reactive({
  firstName: '',
  lastName: '',
  emailContact: '',
  phone: null,
  amountOfGuest: '',
  date: '',
  time: '',
  message: ''
});
const isfirstNameRequired = ref(true)
const islastNameRequired = ref(true)
const isemailContactRequired = ref(true)
const isphoneRequired = ref(true)
const isamountOfGuestRequired = ref(true)
const ismessagetRequired = ref(true)
const isdateRequired = ref(true)
const istimeRequired = ref(true)

if (blok.hide_fields?.includes('first_name'))   { isfirstNameRequired.value = false }
if (blok.hide_fields?.includes('last_name'))    { islastNameRequired.value = false }
if (blok.hide_fields?.includes('email'))        { isemailContactRequired.value = false }
if (blok.hide_fields?.includes('phone'))        { isphoneRequired.value = false }
if (blok.hide_fields?.includes('est_guests'))   { isamountOfGuestRequired.value = false }
if (blok.hide_fields?.includes('message'))      { ismessagetRequired.value = false }
if (blok.hide_fields?.includes('desired_date')) { isdateRequired.value = false }
if (blok.hide_fields?.includes('desired_time')) { istimeRequired.value = false }

const rules = ref({})

if (isfirstNameRequired.value == true) {
  rules.value['firstName'] = { required: helpers.withMessage('First Name field cannot be empty', required)}
}
if (islastNameRequired.value == true) {
  rules.value['lastName'] = { required: helpers.withMessage('Last Name field cannot be empty', required)}
}
if (isemailContactRequired.value == true) {
  rules.value['emailContact'] = {
    emailValidator: helpers.withMessage('Email address is not valid', emailValidator),
    required: helpers.withMessage('Email Contact field cannot be empty', required)
  }
}
if (isphoneRequired.value == true) {
  rules.value['phone'] = { required: helpers.withMessage('Phone field cannot be empty', required) }
}
if (isamountOfGuestRequired.value == true) {
  rules.value['amountOfGuest'] = { required: helpers.withMessage('Amount of Guest field cannot be empty', required) }
}
if (ismessagetRequired.value == true) {
  rules.value['message'] = { required: helpers.withMessage('Message field cannot be empty', required) }
}
if (isdateRequired.value == true){
  rules.value['date'] = { required: helpers.withMessage('Date field cannot be empty', required) }
}
if (istimeRequired.value == true) {
  rules.value['time'] = { required: helpers.withMessage('Time field cannot be empty', required) }
}

const v$ = useVuelidate(rules, state);
async function onSubmit(e) {
  
  const valid = await v$.value.$validate();

  console.log('submitting', valid, blok.form_spark_id)

  if (!valid) return;
  submitText.value.textContent = 'Submitting';
  const resp =  await submitFormsparkForm( 
    e,
    blok.form_spark_id ? blok.form_spark_id : 'H802b843',
    submitText.value,
    successMessage.value
  )
  submitButton.value.setAttribute('disabled', 'disabled');
  return resp
}

function onChangeForm() {
  submitText.value.textContent = 'Submit';
  submitButton.value.removeAttribute('disabled');
  successMessage.value.textContent = '';
}
</script>

