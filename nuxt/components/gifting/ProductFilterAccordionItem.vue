<template>
  <li
    v-if="title"
    class="border-t border-b -mt-[1px] border-black accordion__item-wrapper px-[50px] py-5"
    ref="accordionWrapper"
    role="tablist"
  >
    <button
      class="
        accordion__title
        flex
        w-full
        items-center
        uppercase
        text-xs
        leading-loose
        tracking-[2px]
        futura-std-medium
      "
      :class="[isExpanded && initialHeight ? 'active' : '']"
      :id="`tab-${convertToSlug(title)}`"
      :aria-controls="`panel-${convertToSlug(title)}`"
      :aria-label="`Expand ${title}`"
      role="tab"
      @click="toggle"
    >

      <span class="flex-1 text-left accordion__title--title-mobile">
        <span class="block uppercase">{{ props.title}}</span>
      </span>
      <IconsPlus v-if="!isExpanded" class="w-[10px]"/>
      <IconsMinus v-if="isExpanded" class="w-[10px]"/>
    </button>
    <div
      :id="`panel-${convertToSlug(title)}`"
      :aria-labelledby="`tab-${convertToSlug(title)}`"
      role="tabpanel"
      class="accordion__desc
        wrapper
        overflow-hidden
        text-center
      "
      :style="{
        height: isExpanded && initialHeight ? initialHeight : '0px',
      }"
    >
      <div ref="tabPanelRef"
        class="
          accordion__tabpanel-inner
          inline-block
          mx-auto
          p-5
        "
        :class="panelClass"
      >
       <slot />
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps(['title', 'panelClass']);
const route = useRoute();
const { richText, convertToSlug } = useUtils();
const isExpanded = ref(false);
const initialHeight = ref(null);
const tabPanelRef = ref();
const accordionWrapper = ref();
let locked = false;

onUpdated(() => {
  if (!tabPanelRef.value) return;
  initialHeight.value = tabPanelRef.value.getBoundingClientRect().height + 'px';
});

watch(
  () => props.shouldClose,
  () => {
    if (locked) return;
    isExpanded.value = false;
  }
);

function toggle() {
  console.log('toggle')
  locked = true;
  isExpanded.value = !isExpanded.value;
}
</script>
<style lang="scss" scoped>
.accordion__desc {
  transition: all 0.1s ease-in-out;
}
</style>
