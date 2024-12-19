<template>
  <div
    class="
      dose-mega-menu
      relative
      py-8
      absolute
      left-1/2
      top-0
      -translate-x-1/2
      h-9
      text-xs
      flex justify-center
      w-full
    "
    :class="{
      'activated' : activeTagIndex >= 0
    }"
    @mouseleave="onMouseLeave"
  >
    <nav
      class="dose-mega__nav h-full flex items-center"
    >
      <ul class="tags-row h-9 text-xs flex mx-3">
        <li
          v-for="(tag, index) in tagsData.tags"
          class="mx-3"
          :key="tag.name"
          role="tablist"
        >
          <div
            class="dose-mega-nav_menu"
            @mouseenter="(e) => onMouseEnter(e, index, tag.name)"
            @click="(e) => onMouseClick(e, index, tag.name)"
            aria-expanded="false"
            role="tab"
          >
            <div
              class="uppercase cursor-pointer font-medium !tracking-[1px]"
              :class="{
                'mid-underline' : (activePageIndex === index || activeTagIndex === index)
              }"
            >
              {{ tag.name }}
            </div>
          </div>
          <div
            v-if="activeTagIndex === index"
            class="dose-mega-nav_content"
            style="height: 0px;"
          >
            <div
              class="
                dose-mega-nav_content-inner
                fixed top-full w-full left-0
                pt-3
                pb-20
                md:px-8
                md:px-[70px]
              "
              @click="onMouseLeave"
            >
              <swiper
                ref="swiperInstance"
                class="!px-4 md:!px-0"
                :slides-per-view="1.5"
                :space-between="25"
                :threshold="20"
                :watch-slides-progress="true"
                :breakpoints="{
                  '768': {
                    slidesPerView: 2.5,
                    spaceBetween: 20
                  },
                  '1024': {
                    slidesPerView: 3.5,
                  },
                  '1280': {
                    slidesPerView: 4,
                  },
                }"
              >
                <swiper-slide
                  v-for="item in DoseDataByTag[tag.name]" :key="item._uuid"
                >
                  <div class="relative mx-auto four-up__item mb-7">
                    <DoseCard
                      :blok="item"
                    />
                  </div>
                </swiper-slide>
              </swiper>
          <nuxt-link
            :to="'/the-dose/category/'+tag.name"
            class="text-mp-color-text-secondary px-4 md:px-0 slug-sm futura-std-medium underline uppercase"
            >SEE ALL {{tag.name}}
          </nuxt-link>
            </div>
          </div>
        </li>
      </ul>

      <button v-if="activeTagIndex !== -1 " class="fixed md:hidden mt-16 z-[-1] top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] h-screen" @click="onMouseLeave">

      </button>
    </nav>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
const { isImage, isVideo } = useUtils();
const route = useRoute();
const version = route.query._storyblok || route.isDev ? 'draft' : 'published';
const storyblokApi = useStoryblokApi();
const activeTagIndex = ref(-1)
const activePageIndex = ref(-1)
const { data: tagsData } = await storyblokApi.get('cdn/tags/', {
  starts_with: 'the-dose/'
});
const story = ref(null)
const DoseDataByTag = ref({})
tagsData.tags.map(async (tag)=>{
  console.log('tag', tag)
  DoseDataByTag.value[tag.name] = await DoseByTag(tag.name)
})
const emit = defineEmits(['set-hover-state']);

async function DoseByTag(tag) {
  const { data } = await storyblokApi.get('cdn/stories/', {
    starts_with: 'the-dose/',
    with_tag: tag
  });
  console.log('data.stories', data.stories)
  return data.stories
}
function onMouseLeave() {
  emit('set-hover-state', false);
  console.log('onMouseLeave')
  activeTagIndex.value = -1
}

function onMouseEnter(e, index, tag) {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/android/i) || userAgent.match(/iphone/i)) {
    return
  }
  calculateHeight(e);
  emit('set-hover-state', true);
  toggleTab(e);
  activeTagIndex.value = index

}

function onMouseClick(e, index, tagName) {
  calculateHeight(e);
  emit('set-hover-state', true);
  toggleTab(e, index);
  let userAgent = navigator.userAgent;
  if (userAgent.match(/android/i) || userAgent.match(/iphone/i)) {
    return
  }
  else{
    navigateTo('/the-dose/category/'+tagName.toLowerCase());
  }
}

function toggleTab(e, index) {
  const currentState = e.target.getAttribute('aria-expanded');
  e.target.setAttribute('aria-expanded', !currentState);
  if (activeTagIndex.value == index) {
    activeTagIndex.value = -1
  } else {
    activeTagIndex.value = index
  }
}


onMounted(() => {
  tagsData.tags.forEach((tag,index)=> {
    if (tag.name === route.params.term) {
      activePageIndex.value = index
    }
  })
});

onBeforeUnmount(() => {
});

watch(route, async (newRoute, oldRoute) => {
  tagsData.tags.forEach((tag,index)=> {
    if (tag.name === route.params.term) {
      activePageIndex.value = index
    }
  })
});

const minImageWrapperHeight = ref(0);


function calculateHeight(el) {
  const listEl = el.target.querySelector('ul');
  if (!listEl) return;
  const height = listEl.getBoundingClientRect()?.height;
  if (height) {
    minImageWrapperHeight.value = height;
  }
}


</script>

<style lang="scss">
.hotel-header__tab-content {
  display: none;
}

.nav-item-hovered .hotel-header__tab-content {
  display: flex;
}

.dose-mega-menu {

  &.activated,
  .dose-mega-nav_content-inner {
    background: var(--mp-off-white);
  }
}

.mobile-header {
  @screen md-down {
    overflow-x: auto;
    justify-content: flex-start;
    width: 100%;
    -webkit-mask-image: linear-gradient(to right, rgb(0, 0, 0) 86%, transparent 100%);

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
