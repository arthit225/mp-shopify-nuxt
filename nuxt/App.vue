<template>
  <div
    id="body"
    :class="[routeLastSegment]"
  >
    <NuxtLayout>
      <div id="shopping-products-teleport"></div>
      <NuxtPage />
    </NuxtLayout>
    <product-choose-currency-modal :show-modal="showCurrencyModal" />
  </div>
</template>

<script setup>
const { currency } = useCurrency();
const showCurrencyModal = ref(false)

function initSmartBot() {

  //Chat bot
  smartbot.init("1d89c6d1-5e54-4ecf-a105-66c687728dd4");
}

function klaviyoTracking(){
  var _learnq = _learnq || [];
  if ('{{ customer.email }}') {
    _learnq.push(['identify', {
        '$email' : '{{ customer.email }}'
      }]);
    }
}
useHead({
  script: [
    {
      src: "https://js.stripe.com/v3/",
    },
  ],
});

const { autoLogin } = useAuth();
await useAsyncData("autoLogin", () => autoLogin());

const route = useRoute();
const version = route.query._storyblok || route.isDev ? "draft" : "published";

const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get(
  "cdn/stories/global-elements/sidebar-menu",
  { version: version }
);
const storyState = reactive({ story: data.story });
// const sideBarMenuData = ref(storyState.story)
provide("sideBarMenuData", storyState.story);

const productCategoryNavData = await storyblokApi.get(
  "cdn/stories/global-elements/product-category-nav",
  { version: version }
);
provide("productCategoryNavData", productCategoryNavData.data.story.content);

const miniCartSettingsData = await storyblokApi.get(
  "cdn/stories/minicart-settings",
  { version: version }
);

console.log("Minicart Settings");
provide("minicartSettings", miniCartSettingsData.data.story.content);


const notSureWhereToStartData = await storyblokApi.get(
  "cdn/stories/global-elements/not-sure-where-to-start",
  { version: version }
);
provide("notSureWhereToStartData", notSureWhereToStartData.data.story.content);

const defaultSEOData = await storyblokApi.get(
  "cdn/stories/global-elements/default-seo",
  { version: version }
);
provide("defaultSEOData", defaultSEOData.data.story.content);

const routeLastSegment = ref(retrieveLastSegment(route.params.handle));

function retrieveLastSegment(params) {
  // if (!params) return;
  // const trimmedParams = params.filter((segment) => (segment ? true : false));
  // const length = trimmedParams.length;
  // if (length > 0) {
  //   return trimmedParams[length - 1];
  // }

  // return '';
  return params;
}

//Disable all pointer events inside of the Storyblok editor.
const pointerEvents = ref(route.query._storyblok_c ? 'none' : 'auto');

if (route.fullPath == '/home') {
  navigateTo('/')
}

function openCurrencyModal() {
  console.log(currency.value)
  if (currency.value == undefined) {
    showCurrencyModal.value = true;
  }
}
onMounted(()=> {
  klaviyoTracking()
  openCurrencyModal()
  //initSmartBot()

  //FB pixel
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ?
      n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
  }(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1093060994395942');
  fbq('track', 'PageView');

})

watch(route, (newRoute) => {
  routeLastSegment.value = retrieveLastSegment(newRoute.params.handle);
  if (route.fullPath == '/home') {
    navigateTo('/')
  }
});
</script>

<style lang="scss">
a {
  pointer-events: v-bind('pointerEvents');
}
.page-enter-to {
  opacity: 1;
}
.page-leave-active {
  transition: opacity 0s ease-out;
}
.page-enter-active {
  transition: opacity 0.6s ease-in;
}
.page-leave-to,
.page-leave-from,
.page-enter-from {
  opacity: 0;
}

</style>