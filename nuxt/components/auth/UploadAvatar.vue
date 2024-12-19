<template>
  <div class="mb-4">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="file">Avatar Image:</label>
        <input
          type="file"
          ref="file"
          accept="image/x-png,image/gif,image/jpeg"
          name="file"
          id="file"
        />
        <button type="submit">Submit</button>
      </div>
      <div v-if="imgSrc">
        Avatar: <img class="w-24 h-auto" width="100" height="100" :src="imgSrc" alt="avatar image">
      </div>
    </form>
  </div>
</template>

<script setup>
const {imgSrc} = defineProps(['img-src'])
const file = ref();
const { token } = useAuth();

async function onSubmit() {
  console.log(file.value.files);
  const imageFile = file.value.files[0];
  const formData = new FormData();
  formData.append('file', imageFile);
  const { data, errors } = await useShopify({
    query: `
    {
        customer(customerAccessToken: "${token.value}") {
          id
        }
    }
    `,
  });
  formData.append('customerId', data.customer.id)

  const response = await $fetch('/api/upload-file', {
    method: 'POST',
    body: formData,
  });

  console.log(response);
}
</script>
