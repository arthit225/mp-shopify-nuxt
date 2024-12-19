<template>
  <div v-if="blok" class="">
    <component
      v-for="localBlok in blok.body"
      :key="localBlok._uid"
      :is="localBlok.component"
      :blok="localBlok"
    />
  </div>
</template>

<script setup>
const { blok } = defineProps({
  blok: {
    type: Object,
    required: true,
  },
});

</script>
