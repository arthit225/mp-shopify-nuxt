<template>
  <div class="pt-28 pb-10">
    <AuthResetPassword v-if="resetUrlExists" />
    <AuthResetSendEmail v-else />
    <nuxt-link :to="{name: 'auth-login'}" class="text-gray-400 underline block mx-auto text-center mt-4"> Back to login</nuxt-link>
  </div>
</template>

<script setup>
const route = useRoute();
const resetUrlExists = ref(route.query['resetUrl'] ? true : false);
</script>
