<template>
  <nav
    class="sidebar-menu fixed left-0 top-0 h-screen overflow-auto w-full sm:w-[33.4375rem] bg-mp-cream z-[100]"
    :class="{
      transform: !isSidebarOpen,
      ['-translate-x-full']: !isSidebarOpen,
    }"
  >
    <div class="flex flex-col h-full">
      <div class="flex justify-between pl-0 pr-[0.625rem] sm:pl-[1.375rem] sm:pr-8 pt-5 mb-7">
        <button
          @click="toggleSidebar"
          class="w-10 h-10 flex justify-center items-center"
        >
          <span class="inline-block w-[1.125rem] h-[1.125rem]">
            <IconsCloseX />
            <span class="sr-only">Close sidebar</span>
          </span>
        </button>

        <nuxt-link
          :to="currency == 'US' ? sideBarMenuData.content.header_button_url_usa.cached_url : sideBarMenuData.content.header_button_url.cached_url"
          :target="'_blank'"
          class="button--secondary mr-4 md:hidden"
        >
          BOOK
        </nuxt-link>

      </div>
      <div class="px-[0.625rem] sm:px-8 mb-10">
        <ThePredictiveSearch
          :query="searchQuery"
          :search="fetchSuggestions"
          class="flex-1"
        />
      </div>
      <div class="px-6 sm:px-8 mb-14">
        <SidebarAccordion />
      </div>
      <div class="px-6 sm:px-8 mb-11 sm:mb-7 flex flex-col">

        <a
          href="https://majestyspleasure.zenoti.com/webstoreNew/services"
          target="_blank"
          ref="signUpElem"
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[2px] py-2 mr-9 block"
        >
          SIGN IN / REGISTER
        </a>

        <!--
        <nuxt-link
          :to="isAuthenticated ? 
            '/' + secondaryMenu?.account[0]?.link?.cached_url : 
            '/' + secondaryMenu?.sign_in[0]?.link?.cached_url "
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[2px] py-2 mr-9 block"
          @click="toggleSidebar"
          >
            {{ isAuthenticated ?
             secondaryMenu?.account[0]?.text
             : secondaryMenu?.sign_in[0]?.text
            }}
        </nuxt-link>
        !-->
        <span v-if="isAuthenticated">
          <button
            class="futura-std-medium text-extra-small leading-[1.81] tracking-[2px] py-2 mr-9 block"
            @click.prevent="logoutWrapper"
          >
            {{ secondaryMenu?.sign_out[0]?.text }}
          </button>
        </span>
        <nuxt-link
          v-for="item in secondaryMenu?.menu_items"
          :key="item._uid"
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[2px] py-2 mr-9 block"
          :to="'/' + item.link.cached_url"
          @click="toggleSidebar"
        >
          {{ item.text }}
        </nuxt-link>
      </div>
      <div class="pl-[1.125rem] sm:mb-5">
        <ul class="flex">
          <li
            v-for="social in sideBarMenuData.content.socials"
            :key="social._uid"
          >
            <a
              :href="social.link.cached_url"
              class="flex w-10 h-10 justify-center items-center"
              target="_blank"
            >
              <span class="inline-block">
                <IconsFacebook v-if="social.name.toLowerCase() == 'facebook'" />
                <IconsInstagram v-else-if="social.name.toLowerCase() == 'instagram'" />
                <IconsTwitter v-else-if="social.name.toLowerCase() == 'twitter'" />
                <IconsYoutube v-else-if="social.name.toLowerCase() == 'youtube'" />
                <IconsTiktok v-else-if="social.name.toLowerCase() == 'tiktok'" />
                <IconsSpotify v-else-if="social.name.toLowerCase() == 'spotify'" />
                <span class="sr-only">{{social.name}} Icon</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div class="flex w-full justify-end mt-auto">
        <nuxt-link
          to="/"
          class="inline-block w-[7.125rem] h-[5.3125rem] sm:w-[13.75rem] sm:h-[10.25rem]"
          @click="toggleSidebar"
        >
          <IconsLogoMark />
          <span class="sr-only">Logo of Majesty's pleasure that links to home page</span>
        </nuxt-link>
      </div>
    </div>

    <Teleport
      v-if="isSidebarOpen"
      to=".js-header"
    >
      <SnippetsBackgroundBlocker
        :z-index="10"
        :triggerFunction="toggleSidebar"
      />
    </Teleport>
  </nav>
</template>

<script setup>
import {computed} from "vue"
import ThePredictiveSearch from './ThePredictiveSearch.vue';
const signUpElem = ref()
const signUpLink = ref("https://majestyspleasure.zenoti.com/webstoreNew/services")
const { currency } = useCurrency();
const { isAuthenticated, logout } = useAuth();
const { toggleSidebar, isSidebarOpen } = useSidebar();
const sideBarMenuData = inject('sideBarMenuData');
const logoutWrapper = () => {
  logout();
};


const secondaryMenu=computed(()=>{
  return sideBarMenuData.content.secondary_menu[0] ? sideBarMenuData.content.secondary_menu[0] : [];
})
const socialMenu=computed(()=>{
  return sideBarMenuData.content.secondary_menu[0] ? sideBarMenuData.content.socials : [];
})
const bookBtnLink = computed(()=>{
  if (currency == 'US') {
    sideBarMenuData.content.header_button_url_usa
  }
  if (currency == 'CA') {
    sideBarMenuData.content.header_button_url
  }
  else {
    sideBarMenuData.content.header_button_url
  }
  
})

const storyblokApi = useStoryblokApi();
const router = useRouter();
const route = useRoute();
const version = route.query._storyblok || route.isDev ? 'draft' : 'published';
const searchQuery = ref(route.query.query ? route.query.query : '')
console.log(route)

const fetchSuggestions = async (searchInput) => {
  const { data } = await storyblokApi.get('cdn/stories/', {
      version: version,
      excluding_slugs: 'global-elements/*',
      search_term: searchInput,
      per_page: 5,
    }
  )

  const query = `{
      products(query:"title:*${searchInput}* OR tag:*${searchInput}*" first:5 ) {
        edges {
          node {
            id
            handle
            title
            description
          }
        }
      }
    }`

  const products = await useShopify({ query })
  
  console.log(products.data.products.edges)

  return {
    stories : data.stories,
    products : products?.data?.products?.edges
  }
}


watch(searchQuery, (searchQuery, previous) => {
  router.push({
    path: '/search',
    query: { search: searchQuery },
  })
})


onMounted( ()=> {
  if (currency?.value == 'US') {
    signUpElem.value.href = "https://majestysusa.zenoti.com/webstoreNew/services/f5a60c3e-bd44-494d-a08a-2268ed01df62";
  }
  else if (currency?.value == 'CA') {
    signUpElem.value.href = "https://majestyspleasure.zenoti.com/webstoreNew/services";
  }
  else {
    signUpElem.value.href = "https://majestyspleasure.zenoti.com/webstoreNew/services";
  }
})
</script>

<style scoped>
.sidebar-menu {
  transition: transform 0.4s ease;
}
</style>
