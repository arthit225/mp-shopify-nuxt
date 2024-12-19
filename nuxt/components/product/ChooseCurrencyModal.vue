<template>
  <SnippetsBackgroundBlocker
    :zIndex="9999"
    v-if="showModal && !isStoryblokView"
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
        <figure class="mx-auto mb-4 w-20 pt-10">
          <IconsLogoMark  class="w-full h-full"/>
        </figure>

        <h1 class="
            m-auto
            py-10
            saol-display-light-italic
            text-[2.688rem]
            md:text-[3.25rem] md:leading-[160%]
            max-w-[497px]
            !leading-tight 
          ">
          Which country are you visiting from?
        </h1>
        <div class="flex text-center justify-center gap-8">
          <button
            @click="selCurrency('CA')"
            class="
              whitespace-pre-line
              text-m
              leading-[1.375rem]
              lg:leading-[1.688rem]
              max-w-[260px]
              mb-8
              underline
            "
            aria-label="CANADA"
          >
            CANADA
          </button>
          <button
            @click="selCurrency('US')"
            class="
              whitespace-pre-line
              text-m
              leading-[1.375rem]
              lg:leading-[1.688rem]
              max-w-[260px]
              mb-8
              underline
            "
            aria-label="USA"
          >
            USA
          </button>
        </div>
      </div>
    </div>
  </SnippetsBackgroundBlocker>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
const route = useRoute();
const { showModal } = defineProps(["show-modal"]);
const emit = defineEmits(["close-modal"]);
const {setCurrency} = useCurrency()
function selCurrency(currency) {
  const cartId = useStorage('cartId')
  cartId.value = null
  setCurrency(currency, {
    expires: 86400000
  })
  emit('close-modal')
  window.location.reload()
}
const isStoryblokView = computed(()=> route.query._storyblok)
</script>
