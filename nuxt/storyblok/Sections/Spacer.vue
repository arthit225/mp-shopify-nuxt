<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="spacer"
    aria-hidden="true"
  >
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const spacerHeightDesktop = blok.height_desktop + 'px'
const spacerHeightMobile = blok.height_mobile + 'px'
</script>

<style lang="scss">
.spacer {
  height: v-bind('spacerHeightMobile');
  @screen md {
    height: v-bind('spacerHeightDesktop');
  }
}
</style>
