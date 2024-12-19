<template>
  <div
    @click="onClick"
    aria-label="Background blocker" 
    class="js-blocker bg_blocker fixed top-0 left-0 w-full h-full cursor-pointer"
    :style="{zIndex: props.zIndex}">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  zIndex: {
    type: Number,
    default: 9
  },
  opacity: {
    type: Number,
    default: 0.1
  },
  triggerFunction: {
    type: Function,
    default: () => {}
  }
})

const visible = ref(false)

function onClick(){
  visible.value = !visible.value
  props.triggerFunction()
}
</script>
<style lang="scss" scoped>
  .bg_blocker {
    --bg-opacity: v-bind('props.opacity');
    background-color: rgba(0,0,0, var(--bg-opacity));
    backdrop-filter: blur(40px)
  }
</style>