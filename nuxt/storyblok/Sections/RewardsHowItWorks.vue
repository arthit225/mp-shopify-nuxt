<template>
  <section
    v-if="blok"
    v-editable="blok"
    class="grid sm:grid-cols-3 text-center rewards-hit">

    <div
      class="rewards-hit__item px-4 py-16 flex items-center justify-center">
      <div>
        <span class="rewards-hit__item-count mx-auto mb-3">
          1
        </span>
        <h2 class="rewards-hit__heading uppercase mb-2 mx-auto slug-l">
          {{blok.step_1_title ? blok.step_1_title : ''}}
        </h2>
        <p class="rewards-hit__subheading uppercase mx-auto  slug-xs">
          {{blok.step_1_text ? blok.step_1_text : ''}}
        </p>
      </div>
    </div>

    <div class="rewards-hit__item px-4 py-16 flex items-center justify-center">
      <div>
        <span class="rewards-hit__item-count mx-auto mb-3">
          2
        </span>
        <h2 class="rewards-hit__heading uppercase mb-2 mx-auto slug-l">
          {{blok.step_2_title ? blok.step_2_title : ''}}
        </h2>
        <p class="rewards-hit__subheading uppercase mx-auto  slug-xs">
          {{blok.step_2_text ? blok.step_2_text : ''}}
        </p>
      </div>
    </div>

    <div class="rewards-hit__item px-4 py-16 flex items-center justify-center">
      <div>
        <span class="rewards-hit__item-count mx-auto mb-3">
          3
        </span>
        <h2 class="rewards-hit__heading uppercase mb-2 mx-auto slug-l">
          {{blok.step_3_title ? blok.step_3_title : ''}}
        </h2>
        <p class="rewards-hit__subheading uppercase mx-auto  slug-xs">
          {{blok.step_3_text ? blok.step_3_text : ''}}
        </p>
      </div>
    </div>    
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
</script>


<style lang="scss" scoped>
h2 {
  max-width: 80%;
  line-height: 1.3;
}
.rewards-hit {
  border-top: solid 1px;
  border-bottom: solid 1px;
  margin: 4.5rem 0;
  background: var(--mp-cream);
  &__item-count {
    width: toRem(40);
    height: toRem(40);
    background: black;
    color: white;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;  
    border-radius: 999px;
    line-height: 1;
  }
  &__item {
    &:nth-child(1),
      &:nth-child(2) {
        border-bottom: solid 1px;
      }
    @screen sm {
      &:nth-child(1),
      &:nth-child(2) {
        border-right: solid 1px;
        border-bottom: none;
      }
    }

  }
  &__subheading {
    
    max-width: 280px;
  }
}
</style>