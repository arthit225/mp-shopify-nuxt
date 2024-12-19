<template>
  <div
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="information-section w-full md:max-w-[560px] break-all"
  >
    <div
      v-for="info in blok.items"
      :key="info._uid"
      class="border-t py-5 border-black"
    >
      <p class="text-xs leading-loose tracking-[2px] mb-6 futura-std-medium">
        {{ info.name }}
      </p>
      <div 
        v-html="richText(info.value)"
        class="text-[2rem] saol-display-light leading-none mb-[45px] has-fancy-underline-children"
      >
      </div>
    </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const { richText } = useUtils();
</script>


<style langs="scss">
.information-section {

}

</style>