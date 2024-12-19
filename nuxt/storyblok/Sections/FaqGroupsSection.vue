<template>
  <div
    v-if="blok"
    v-editable="blok"
    :data-id="blok._uid"
    :data-component="blok.component"
    :id="blok._uid"
    class="faq-group-section md:max-w-[600px] lg:max-w-[540px] mb-[100px] w-full"
  >
    <h2 class="text-[2rem] saol-display-light leading-none mb-4">
      {{blok.title}}
    </h2>
    <div>
      <div
        v-for="faq_group in blok.faq_groups"
        v-editable="faq_group"
        :key="faq_group._uid"
        class="mb-8"
      >
        <template
          v-if="faq_group"
        >
          <h3 class="text-[2rem] saol-display-light-italic pb-8">
            {{faq_group.title}}
          </h3>
          <ul>
            <faq-accordion-item
              v-for="item in faq_group.items"
              v-editable="item"
              :item="item"
              :index="item._uid"
              :key="item._uid"
              :scroll="false"
            >
            </faq-accordion-item>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });

</script>

