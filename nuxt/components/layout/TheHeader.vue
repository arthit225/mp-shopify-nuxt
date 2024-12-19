<template>
  <nav class="header js-header sticky top-0 left-0 z-[10] w-full bg-white">
    <div class="flex items-center justify-between relative pl-2 pr-2 lg:pr-6 lg:pl-6 py-3 lg:py-4">
      <button
        @click="toggleSidebar"
        class="toggle-sidebar-button flex justify-center items-center futura-std-medium text-extra-small leading-[1.33] tracking-[0.1em] py-2 px-2 min-h-[2.5rem] min-w-[2.5rem]"
      >
        <span class="hidden lg:block">MENU</span>
        <span class="inline-block w-5 h-[0.8125rem] lg:hidden">
          <IconsNavHamburger />
          <span class="sr-only">Toggle Main Nav Menu</span>
        </span>
      </button>
      <nuxt-link
        to="/"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 leading-[1]"
      >
        <span class="sr-only">Majesty's Pleasure Logo</span>
        <span class="inline-block w-[6.125rem] h-[1.875rem] lg:w-[7rem] lg:h-[2.125rem]">
          <IconsLogoWritten />
        </span>
      </nuxt-link>
      <div class="flex items-center">

        <div class="
            header__country-toggle
            futura-std-medium
            sm:mr-4
            border
            select-wrapper
          ">
          <label>
            <span class="sr-only">Switch country</span>
            <select
              @change="switchCountries"
              class="text-left"
            >
              <option
                value="CA"
                :selected="currency == 'CA' ?? true"
              >CANADA</option>
              <option
                value="US"
                :selected="currency == 'US' ?? true"
              >USA</option>
            </select>
          </label>
        </div>

        <button
          class="flex justify-center items-center w-10 h-10 mr-4 lg:pb-[0.375rem]"
          v-if="giftingCartsCount > 0 "
          @click="toggleGiftCart"
        >
          <span class="relative inline-block w-[1.0625rem] h-[1.375rem] lg:w-[1.375rem] lg:h-[1.625rem]">
            <span class="sr-only">Open gift cart trigger</span>
            <span class="absolute pt-2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[0.625rem]">{{
              giftingCartsCount }}</span>
            <IconsGiftCart class="h-full w-full" />
          </span>
        </button>
        <a
          href="https://majestyspleasure.zenoti.com/webstoreNew/services"
          ref="signUpElem"
          target="_blank"
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[0.10em] py-2 hidden lg:block mr-9"
        >
          SIGN IN / REGISTER
        </a>

        <!--
        <nuxt-link
          :to="isAuthenticated ? '/auth/account' : '/auth/login'"
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[0.10em] py-2 hidden lg:block"
          :class="[isAuthenticated ? '' : 'mr-1']"
          >{{ isAuthenticated ? "ACCOUNT / " : "SIGN IN /" }}</nuxt-link>
        <nuxt-link
          v-if="!isAuthenticated"
          :to="'/auth/register'"
          class="futura-std-medium text-extra-small leading-[1.81] tracking-[0.10em] py-2 hidden lg:block mr-9"
          >{{"REGISTER"}}</nuxt-link>
        <span v-if="isAuthenticated">
          <button class="futura-std-medium text-extra-small leading-[1.81] tracking-[0.10em] py-2 mr-9 hidden lg:block" @click.prevent="logoutWrapper">
            &nbsp;LOGOUT
          </button>
        </span>
        !-->

        <nuxt-link
          :to="currency == 'US' ? bookBtnLinkUsa.cached_url : bookBtnLink.cached_url"
          target="_blank"
          class="button--secondary mr-4 hidden md:block"
        >
          BOOK
        </nuxt-link>

        <button
          class="flex justify-center items-center w-10 h-10 lg:pb-[0.375rem]"
          @click="toggleMiniCart"
        >
          <span class="relative inline-block w-[1.0625rem] h-[1.375rem] lg:w-[1.375rem] lg:h-[1.625rem]">
            <span class="sr-only">Open cart trigger</span>
            <span class="absolute pt-1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[0.625rem]">{{
              cartCount }}</span>
            <IconsTheCart />
          </span>
        </button>
      </div>
      <!-- <CurrencySelect class="inline-block mr-4" /> -->
    </div>
    <LayoutDoseMega
      v-if="showDoseMega"
      @set-hover-state="setHoverState"
      :class="{
        'hovered': isHovered
      }"
    />
    <LayoutProductCategoryNav v-if="showProductCatNav" />
  </nav>

</template>

<script setup>
const { currency, setCurrency } = useCurrency()
const { toggleMiniCart, cartCount } = useCart();
const { isAuthenticated, logout } = useAuth();
const { toggleSidebar } = useSidebar();
const { toggleGiftCart, giftingCartsCount } = useGiftCart();
const signUpElem = ref()
const signUpLink = ref("https://majestyspleasure.zenoti.com/webstoreNew/services")
const showDoseMega = ref(false);
const showProductCatNav = ref(false);
const sideBarMenuData = inject('sideBarMenuData');

const bookBtnLink = computed(()=>{
  return sideBarMenuData.content.header_button_url
})

const bookBtnLinkUsa = computed(() => {
  return sideBarMenuData.content.header_button_url_usa
})

const route = useRoute();
const logoutWrapper = () => {
  logout();
};


console.log('route.path', route.path)
function check_route(route) {
  if (route.path === '/the-dose' || route.path.includes('/the-dose/')) {
    showDoseMega.value = true;
  } else {
    showDoseMega.value = false;
  }
  if (
    route.path === '/product' || 
    route.path.includes('/product/') ||
    route.path === '/shop' ||
    route.path.includes('/shop/') ||
    route.path.includes('/gift-card') ||
    route.path.includes('global-elements/product-category-nav') 
  ){
    showProductCatNav.value = true;
  } else {
    showProductCatNav.value = false;
  }
}
check_route(route);
watch(route, async (newRoute, oldRoute) => {
  check_route(route);
  setHoverState(false);
});
const isHovered = ref(false);
function setHoverState(boolean) {
  isHovered.value = boolean
  if (boolean) {
    document.getElementById('body').classList.add('nav-item-hovered');
  } else {
    document.getElementById('body').classList.remove('nav-item-hovered');
  }
}

function switchCountries(e) {
  var countryCode = e.target.value
  setCurrency(countryCode)
  //delete the cartID because its for the old county. 
  localStorage.removeItem('cartId')
  location.reload()
}
onMounted(() => {
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

<style lang="scss" scoped>
.header {
  &__country-toggle {
    min-width: toRem(78); 
    @screen sm {
      min-width: toRem(88);
    }
    select {
      font-size: toRem(10);
      @screen sm {
        font-size: toRem(12);
      }
      background-size: .65rem;
      background-position: 90%;
      padding: 6px 8px 6px 3px;
      text-indent: .375rem;
      letter-spacing: 0.04em;
    }
  }
}
.logo {
  border: solid 1px;
  width: 116px;
}
.toggle-sidebar-button {
  transition: color ease-out .3s;
  &:hover {
    color: lighten(black , 50%);
  }
}
</style>
