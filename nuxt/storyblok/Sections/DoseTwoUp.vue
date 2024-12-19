<template>
  <section
    class="dose-two-up-section max-w-[1106px] mx-auto"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
  >
    <DoseToUpItem
      v-for="item in blok.items"
      :key="item._uid"
      :blok="item"
    />
  </section>
</template>
<script setup>
const { blok } = defineProps({ blok: Object });
</script>
