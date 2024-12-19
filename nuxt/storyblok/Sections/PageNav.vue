<template>
  <div
    class="
      page-nav
      relative
      py-5
      absolute
      left-1/2
      top-0
      -translate-x-1/2
      text-xs
      flex justify-center
      w-full
      border-t
      border-mp-gray
      md:border-0
    "
    :class="{
      'activated' : activeTagIndex >= 0
    }"
  >
    <nav
      class="page__nav h-full flex items-center"
    >
      <ul
        class="
          tags-row
          text-xs
          mx-[6px]
          flex flex-wrap">
        <li
          v-for="(nav, index) in blok.items"
          :key="nav.link"
          class="nav-nav-item relative mx-3 my-3"
          role="tablist"
          @mouseenter="(e) => onMouseEnter(e, index, nav.sub_items ? nav.sub_items.length : 0)"
          @click="(e) => onMouseClick(e, index, nav.sub_items ? nav.sub_items.length : 0)"
          @mouseleave="(e)=>onMouseLeave(e)"
        >
          <div
            class="nav-nav__tab-title justify-center js-tab-title flex items-center whitespace-nowrap"
          >
            <NuxtLink
              class="uppercase cursor-pointer font-medium !tracking-[1px]"
              :class="{
                'mid-underline' : (activePageIndex === index || activeTagIndex === index)
              }"
              :to="nav.link.linktype == 'story' ? '/'+nav.link.cached_url : nav.link.url"
              :target="nav.link.linktype == 'story' ? '_self':'_blank'"
            >
              {{ nav.title }}
            </NuxtLink>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const { blok } = defineProps({ blok: Object });
const route = useRoute();
const activeTagIndex = ref(-1)
const activePageIndex = ref(-1)
const isDesktop = ref(false);
function isDesktopFunction() {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (width >= 1024) {
    isDesktop.value = true;
  } else {
    isDesktop.value = false;
  }
}
watch(isDesktop, () => {
});
function onMouseLeave() {
  console.log('onMouseLeave')
  activeTagIndex.value = -1
}

function onMouseEnter(e, index, childrenLength) {
  if (isDesktop.value === false) return;
  console.log('onMouseEnter')
  activeTagIndex.value = index
}
function onMouseClick(e, index, childrenLength) {
  if (isDesktop.value === true ) {
    return;
  }
  console.log('onMouseClick', 'childrenLength', childrenLength)

  activeTagIndex.value = index
 }
onMounted(() => {
  isDesktopFunction();
  window.addEventListener('resize', isDesktopFunction);
  blok.items.forEach((nav,index)=> {
    const nav_url = nav.link.url ? nav.link.url :(nav.link.cached_url ? '/'+nav.link.cached_url : '/')
    if ( route.path.includes(nav_url)) {
      activePageIndex.value = index
    }
  })
});

watch(route,  (newRoute, oldRoute) => {
  blok.items.forEach((nav,index)=> {
    const nav_url = nav.link.url ? nav.link.url :(nav.link.cached_url ? '/'+nav.link.cached_url : '/')
    if ( route.path.includes(nav_url)) {
      activePageIndex.value = index
    }
  })
});

</script>

<style lang="scss">
  //NAV ITEMS
  .has-children {
    .child,
    .nav-item-hovered & {
      cursor: pointer;
      .child {
        display: flex;
        visibility: visible;
        opacity: 1;
      }
    }
  }
  .nav-nav {
  &__children-wrapper {
      width: auto;
  }
  &__tab-title[aria-expanded='true'] + &__tab-content {
    .nav-nav__children-wrapper {
      z-index: 10;
    }
  }
}
</style>
