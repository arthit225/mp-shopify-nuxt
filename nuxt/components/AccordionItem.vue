<template>
  <li
    v-if="props.item.title"
    class="border-t border-b -mt-[1px] border-black accordion__item-wrapper"
    ref="accordionWrapper"
    role="tablist"
  >
    <button
      type="button"
      class="py-4 flex w-full items-center accordion__title uppercase text-xs leading-loose tracking-[2px] futura-std-medium"
      :class="[isExpanded && initialHeight ? 'active' : '']"
      :id="`tab-${convertToSlug(props.item.title)}-${props.index}`"
      :aria-controls="`panel-${convertToSlug(props.item.title)}-${props.index}`"
      :aria-label="`Expand ${props.item.title}`"
      role="tab"
      @click="toggleFunc"
    >

      <span class="flex-1 text-left accordion__title--title-mobile">
        <span class="block">{{ props.item.title}}</span>
      </span>
      <IconsPlus v-if="!isExpanded" class="w-[11px]"/>
      <IconsMinus v-if="isExpanded" class="w-[11px]"/>
    </button>
    <div
      :id="`panel-${convertToSlug(props.item.title)}-${props.index}`"
      :aria-labelledby="`tab-${convertToSlug(props.item.title)}-${props.index}`"
      role="tabpanel"
      class="accordion__desc wrapper overflow-hidden"
      v-if="props.item.description"
      :style="{
        height: isExpanded && initialHeight ? initialHeight : '0px',
      }"
    >
      <div ref="tabPanelRef" class="accordion__tabpanel-inner">
        <div
          v-if="props.useRichText"
          class="pb-8 futura-std-medium fu-font-medium text-sm"
          v-html="richText(props.item.description)"
        >
        </div>
        <div
          v-else
          class="pb-8 futura-std-medium fu-font-medium text-sm"
          v-html="props.item.description"
        >
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps(['item', 'index', 'useRichText']);
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

function toggleFunc() {
  locked = true;
  isExpanded.value = !isExpanded.value;
}
</script>
<style lang="scss" scoped>
.accordion__desc {
  transition: all 0.1s ease-in-out;
}
</style>
