<template>
  <div>
    <ul class="flex gap-10 justify-center py-10">
      <li>
        <button
          @click="emit('update-step', 1)"
          :class="activeStep == 1 ? 'active mid-underline' : ''"
        >
          STEP 1
        </button>
      </li>
      <li>
        <button
          @click="emit('update-step', 2)"
          :class="activeStep == 2 ? 'active mid-underline' : ''"
        >
          STEP 2
        </button>
      </li>
      <li>
        <button
          @click="emit('update-step', 3)"
          :class="activeStep == 3 ? 'active mid-underline' : ''"
        >
          STEP 3
        </button>
      </li>
      <li>
        <button
          @click="emit('update-step', 4)"
          :class="activeStep == 4 ? 'active mid-underline' : ''"
        >
          STEP 4
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  const { activeStep } = defineProps(['active-step']);
  const emit = defineEmits(['update-step']);
</script>

<style scoped>

</style>
