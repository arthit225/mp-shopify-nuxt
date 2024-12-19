<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="text-section md:max-w-[600px] lg:max-w-[540px] overflow-hidden"
  >
    <h2
      class="text-[2rem] saol-display-light leading-none mb-[55px]"
    >
      {{ blok.heading }}
    </h2>
    <div
      v-html="richText(blok.content)"
      class="text-xs leading-[24px] mb-[55px] font-light futura-std-medium"
    />
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
</script>

<style lang="scss">
.text-section {
  h1 {
    margin-bottom: toRem(10);
  }
  p {
    margin-bottom: toRem(20);
  }
}
</style>
