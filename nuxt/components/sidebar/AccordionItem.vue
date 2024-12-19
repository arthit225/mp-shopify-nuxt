<template>
  <li
    v-if="title"
    :role="children && children.length > 0 ? 'tablist' : ''"
    class="sidebar-accordion__item"
  >
 
    <button
      v-if="children && children.length > 0"
      class="
        saol-display-light
        leading-[1.52]
        flex
        items-center
      "
      :class="{
        'text-[3.375rem]' : level <= 1,
        'text-[1.675rem]' : level > 1
      }"
      :id="uuid2"
      :aria-controls="uuid"
      role="tab"
      @click="toggle"
    >
      {{ title }} 
      <span
        class="inline-block ml-2"
        :class="{
          'w-7 h-7': level <= 1,
          'w-4 h-4': level > 1,
        }"
      >
        <IconsMinus v-if="isExpanded" />
        <IconsPlus v-if="!isExpanded"/>
      </span>
    </button>
    <nuxt-link
      v-else-if="link && link.cached_url"
      :to="currency == 'US' && child?.us_alternate_link?.url ? child?.us_alternate_link?.url : link.linktype === 'story' ? '/' + link.cached_url : link.url"
      :target="link.linktype !== 'story' ? '_blank' : ''"
      :data-us-link="uslink"
      class="
        saol-display-light
        leading-[1.52]
        flex
        items-center
      "
      :class="{
        'text-[3.375rem]' : level <= 1,
        'text-[1.675rem]' : level > 1
      }"
      :id="uuid2"
      @click.native="toggleSidebar"
    >
      {{ title }}
    </nuxt-link>
    <div
      :id="uuid"
      :aria-labelledby="uuid2"
      role="tabpanel"
      class="
        wrapper
        overflow-hidden
        saol-display-light
        text-[1.675rem]
        leading-[1.52]
      "
      v-if="children && children.length > 0"
      :style="{
        height: isExpanded && initialHeight ? initialHeight : '0px',
      }"
    >
      <ul
        ref="ul"
        :class="level>1 ?'pl-[1em]' :''"
      >
        <template
          v-for="child in children"
        >

          <SidebarAccordionItem
            :key="child.title"
            v-if="child.site_nav_sub_items"
            class="px-3 py-1 foo"
            :title="child.title"
            :link="child.link"
            :uslink="child.us_alternate_link"
            :children="child.site_nav_sub_items"
            :level="level+1"
            :child="child"
            @toggle="resizeUl"
          />
          <li
             v-else-if="child.link"
            :key="child.title"
          >
            <nuxt-link
              v-if="child.link.url || child.link.cached_url"
              @click.native="toggleSidebar"
              class="px-3 py-1"
              :to="
                child.link.linktype === 'story'
                  ? '/' + child.link.cached_url
                  : child.link.url
              "
              >{{ child.title }}
            </nuxt-link>
            <p
              v-else
              class="px-3 py-1"
            >
              {{ child.title }}
            </p>
          </li>
        </template>
      </ul>
    </div>
  </li>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
const { currency } = useCurrency()
const emit = defineEmits(['toggle']);
const { toggleSidebar } = useSidebar();
const { title, link, children, level, uslink, child } = defineProps(["title", "link", "children", "level", "uslink", "child"]);
const isExpanded = ref(false);
const initialHeight = ref(null);
const ul = ref();

const uuid = uuidv4();
const uuid2 = uuidv4();

function toggle() {
  isExpanded.value = !isExpanded.value;
  resizeUl()
  setTimeout(function() {
    emit('toggle')
  }, 200)
}
function resizeUl() {
  console.log('resizeUl')
  if (!ul.value) return;
  const clientRect = ul.value.getClientRects();
  if (clientRect && clientRect.length > 0) {
    initialHeight.value = ul.value.getClientRects()[0].height + "px";
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  transition: height 0.2s ease-in-out;
}
.sidebar-accordion__item {
  button,
  a {
    transition: color ease-out .3s;
    @media (hover: hover) {
      &:hover {
        color: lighten(black, 60%);
      }
    }
  }

}
</style>
