<template>
  <SnippetsBackgroundBlocker
    :zIndex="99"
    v-if="showModal"
    style="background-color: rgba(0,0,0, 0.4);"
  >
    <div
      @click.stop
      class="
        fixed
        w-[90%]
        md:w-[70%]
        max-w-[789px]
        max-h-[446px]
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
        bg-white
        z-10
        cursor-auto
        overflow-auto
        p-4
        pointer-events-auto
      "
    >
      <div class="text-center">
        <h1
          class="
            m-auto
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
            max-w-[497px]
          "
        >
          Are you over legal drinking age ?
        </h1>
        <div class="flex text-center justify-center mt-8 gap-8">
          <button
            @click="agreeFunc"
            class="
              whitespace-pre-line
              text-xs
              leading-[1.375rem]
              lg:leading-[1.688rem]
              max-w-[260px]
              mb-8
              underline
            "
            aria-label="Click to confirm you're over the legal drinking age in your territory"
          >
            YES
          </button>
          <nuxt-link
            class="
              whitespace-pre-line
              text-xs
              leading-[1.375rem]
              lg:leading-[1.688rem]
              max-w-[260px]
              mb-8
              underline
            "
            aria-label="Click if you're not over the legal drinking age in your territory"
          >
            NO
          </nuxt-link>
        </div>
      </div>
    </div>
  </SnippetsBackgroundBlocker>
</template>

<script setup>
const { showModal } = defineProps(["show-modal"]);
const emit = defineEmits(["close-modal"]);

function agreeFunc() {
  
  const legalValue = useCookie('legalValue')
  legalValue.value = true;
  emit('close-modal')
}
</script>
