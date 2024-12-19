<template>
  <section
    v-if="blok"
    v-editable="blok"
    class="mx-auto container px-4">

    <header class="text-center mb-10">
      <h2 class="heading-m capitalize">Ways to earn points</h2>
      
    </header>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-center rewards-point-system">

      <div
        v-for="item in blok.items"
        :key="item._uid"
        v-editable="item"
        class="
          rewards-point-system__item
          flex
          items-center
          justify-center
          relative
       ">
        <div class="rewards-point-system__inner uppercase">
          <figure class="rewards-point-system__icon mb-6 block">
            <img
              v-if="item.icon"
              :src="item.icon.filename?item.icon.filename: ''"
              class="blok mx-auto"
              width="72"
              height="72"
              loading="lazy"
              alt=""
            />
          </figure>
          <h2 class="mb-6 leading-none slug-m">
            {{ item.title ? item.title: '' }}
          </h2>
          <p class="slug-sm">
            {{ item.subtitle ? item.subtitle: '' }}
          </p>
        </div>
        <div
          class="
            bg-wheat
            absolute
            flex
            flex-col
            top-0 right-0 bottom-0 left-0
            rewards-point-system__item-hover
          ">
          <a
            href="https://majestyspleasure.zenoti.com/webstoreNew"
            class="button button--primary uppercase mb-3"
            target="_blank">
            Sign up
          </a>
          <p class="text-sm">Already a member? <a href="https://majestyspleasure.zenoti.com/webstoreNew" class="fancy-underline fancy-underline--has-underline" target="_blank">Login</a></p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
</script>

<style lang="scss" scoped>
.rewards-point-system {
  @screen sm {margin-bottom: 4rem;}
  h2 {
    max-width: 80%;
    line-height: 1.2;
  }
  &__item {
    border: solid 1px;
    position: relative;
    aspect-ratio: 1 / 1;
    &:hover {
      .rewards-point-system__item-hover {
        opacity: 1;
      }
    }    
  }
  &__inner {
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  
  }  
  &__item-hover {
    background: var(--mp-cream);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }
}
</style>
