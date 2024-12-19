<template>
  <section
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="section-spacing"
  >
    <span class="sr-only">section spacing</span>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const spaceBetween = blok.space_between + 'px';
</script>

<style lang="scss">
  .section-spacing {
    display: block;
    margin-bottom: v-bind('spaceBetween');
  }
</style>