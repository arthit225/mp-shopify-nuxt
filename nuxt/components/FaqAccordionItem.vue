<template>
  <li
    v-if="props.item.question"
    v-editable="props.item"
    class="border-t border-b -mt-[1px] border-black accordion__item-wrapper"
    ref="accordionWrapper"
    role="tablist"
  >
    <button
      class="py-8 flex w-full items-center accordion__title uppercase text-xs leading-loose tracking-[2px] futura-std-medium"
      :class="[isExpanded && initialHeight ? 'active' : '']"
      :id="`tab-${convertToSlug(props.item.question)}-${props.index}`"
      :aria-controls="`panel-${convertToSlug(props.item.question)}-${props.index}`"
      :aria-label="`Expand ${props.item.question}`"
      role="tab"
      @click="toggle"
    >

      <span class="flex-1 text-left accordion__title--title-mobile">
        <span class="block">{{ props.item.question}}</span>
      </span>
      <IconsPlus v-if="!isExpanded" class="w-[10px]"/>
      <IconsMinus v-if="isExpanded" class="w-[10px]"/>
    </button>
    <div
      :id="`panel-${convertToSlug(props.item.question)}-${props.index}`"
      :aria-labelledby="`tab-${convertToSlug(props.item.question)}-${props.index}`"
      role="tabpanel"
      class="accordion__desc wrapper overflow-hidden"
      v-if="props.item.answer"
      :style="{
        height: isExpanded && initialHeight ? initialHeight : '0px',
      }"
    >
      <div ref="tabPanelRef" class="accordion__tabpanel-inner">
        <div
          class="pb-8 leading-loose tracking-[2px] text-extra-small futura-std-medium"
          v-html="richText(props.item.answer)"
        >
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps(['item', 'index']);
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

<style lang="scss">
.accordion__tabpanel-inner {
  ul {
    list-style: disc !important;
    list-style-type: disc !important;
    list-style-position: inside !important;
    padding-left: 1rem;
    li
    {
      list-style: disc !important;
    }
  }
}
</style>