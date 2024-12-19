<template>
  <div
    class="product-category-nav relative py-5 absolute left-1/2 top-0 -translate-x-1/2 text-xs flex justify-center w-full"
    :class="{
      activated: activeTagIndex >= 0,
    }"
  >
    <nav class="product-category__nav h-full flex items-center">
      <ul class="tags-row text-xs mx-[6px] flex flex-wrap">
        <li
          v-for="(cat, index) in productCategoryNavData.items"
          :key="cat.handle"
          class="cat-nav-item relative mx-3 my-3"
          :class="
            cat.sub_items && cat.sub_items.length > 0 ? 'has-children' : ''
          "
          role="tablist"
          @mouseenter="
            (e) =>
              onMouseEnter(e, index, cat.sub_items ? cat.sub_items.length : 0)
          "
          @click="
            (e) =>
              onMouseClick(e, index, cat.sub_items ? cat.sub_items.length : 0)
          "
          @mouseleave="(e) => onMouseLeave(e)"
        >
          <div
            class="cat-nav__tab-title justify-center js-tab-title flex items-center whitespace-nowrap"
          >
            <div
              v-if="cat.sub_items && cat.sub_items.length"
              class="uppercase cursor-pointer font-medium !tracking-[1px]"
              :class="{
                'mid-underline':
                  activePageIndex === index || activeTagIndex === index,
              }"
            >
              {{ cat.Title }}
            </div>
            <NuxtLink
              v-else
              class="uppercase cursor-pointer font-medium !tracking-[1px]"
              :class="{
                'mid-underline':
                  activePageIndex === index || activeTagIndex === index,
              }"
              :to="
                cat.handle.linktype == 'story'
                  ? '/' + cat.handle.cached_url
                  : cat.handle.url
              "
              :target="cat.handle.linktype == 'story' ? '_self' : '_blank'"
            >
              {{ cat.Title }}
            </NuxtLink>
            <span v-if="cat.sub_items && cat.sub_items.length" class="ml-2">
              {{ activeTagIndex === index ? "−" : "+" }}
            </span>
          </div>
          <div v-if="cat.sub_items && cat.sub_items.length">
            <div
              :class="activeTagIndex == index ? '' : 'h-0 overflow-hidden'"
              class="cat-nav__children-wrapper absolute top-full left-1/2 child transform -translate-x-[50%] z-[1] text-center"
            >
              <div class="flex justify-center items-center h-full">
                <ul
                  class="
										flex
										flex-col
										mt-1
										cat-nav__child-ul
										p-4
										bg-white
										w-[200px]
									"
									:class="[ cat.sub_items.length > 15 ? 'split':'no-split' ]"
                >
                  <li
                    v-for="child in cat.sub_items"
                    :key="child._uid"
                    class="relative leading-[1.3] hover:underline cursor-pointer mb-3 text-center cat-nav__child-li"
                    @click="(e) => onSubItemClick(e)"
                  >
                    <nuxt-link
                      v-if="child.link.cached_url"
                      :to="'/' + child.link.cached_url"
                      class="whitespace-pre-line inline-block"
                    >
                      {{ child.Title }}
                    </nuxt-link>
                    <nuxt-link
                      v-else-if="child.link.url"
                      :to="child.link.url"
                      class="whitespace-pre-line inline-block"
                    >
                      {{ child.Title }}
                    </nuxt-link>
                    <div v-else class="whitespace-pre-line inline-block">
                      {{ child.Title }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const productCategoryNavData = inject("productCategoryNavData");
const route = useRoute();
const activeTagIndex = ref(-1);
const activePageIndex = ref(-1);
const isDesktop = ref(false);
const isSubItemClicked = ref(false);
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
watch(isDesktop, () => {});
function onMouseLeave() {
  console.log("onMouseLeave");
  activeTagIndex.value = -1;
}

function onMouseEnter(e, index, childrenLength) {
  if (isDesktop.value === false) return;
  console.log("onMouseEnter");
  activeTagIndex.value = index;
}
function onMouseClick(e, index, childrenLength) {
  if (isDesktop.value === true || isSubItemClicked.value) {
    isSubItemClicked.value = false;
    return;
  }
  console.log("onMouseClick", "childrenLength", childrenLength);

  activeTagIndex.value = index;
}
function onSubItemClick(e) {
  console.log("onSubItemClick", onSubItemClick);
  isSubItemClicked.value = true;
  activeTagIndex.value = -1;
}
onMounted(() => {
  isDesktopFunction();
  window.addEventListener("resize", isDesktopFunction);
  productCategoryNavData.items.forEach((cat, index) => {
    const cat_url = cat.handle.url
      ? cat.handle.url
      : cat.handle.cached_url
      ? "/" + cat.handle.cached_url
      : "/";
    if (route.path.includes(cat_url)) {
      activePageIndex.value = index;
    }
  });
});

watch(route, (newRoute, oldRoute) => {
  productCategoryNavData.items.forEach((cat, index) => {
    const cat_url = cat.handle.url
      ? cat.handle.url
      : cat.handle.cached_url
      ? "/" + cat.handle.cached_url
      : "/";
    if (route.path.includes(cat_url)) {
      activePageIndex.value = index;
    }
  });
});
</script>

<style lang="scss">
.cat-nav__child-ul {
	box-shadow: 0 10px 10px rgba(black ,  .05);
}
.cat-nav__child-ul {
	&.split {
		column-count: 2;
		display: block;
		padding: 1rem;
		min-width: 280px;
	}
}
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
.cat-nav {
  &__children-wrapper {
    width: auto;
  }
  &__tab-title[aria-expanded="true"] + &__tab-content {
    .cat-nav__children-wrapper {
      z-index: 10;
    }
  }
}
</style>
