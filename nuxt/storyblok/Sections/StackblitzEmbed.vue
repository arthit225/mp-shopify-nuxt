<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="code-section w-full overflow-hidden"
    v-html="blok.text"
  >
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
</script>

<style lang="scss">

</style>
