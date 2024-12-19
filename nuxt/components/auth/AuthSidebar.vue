<template>
  <div class="
      account-sidebar
      left-side-nav
   ">
    <div class="account-sidebar__link">
      <nuxt-link to="/auth/account" class="text-xs
              leading-loose
              tracking-[2px]
              futura-std-medium
              relative
            ">
        ACCOUNT
      </nuxt-link>
    </div>
    <div class="account-sidebar__link">
      <nuxt-link to="/auth/account/orders" class="text-xs
              leading-loose
              tracking-[2px]
              futura-std-medium
              relative
            ">
        ORDERS
      </nuxt-link>
    </div>
    <div class="account-sidebar__link">
      <nuxt-link to="/auth/account/addresses" class="text-xs
              leading-loose
              tracking-[2px]
              futura-std-medium
              relative
            ">
        ADDRESSES
      </nuxt-link>
    </div>
    <div class="account-sidebar__link">
      <nuxt-link to="/auth/account/subscriptions" class="text-xs
              leading-loose
              tracking-[2px]
              futura-std-medium
              relative
            ">
        SUBSCRIPTIONS
      </nuxt-link>
    </div>
    <div class="account-sidebar__link">
      <button class="text-xs
              leading-loose
              tracking-[2px]
              futura-std-medium
              relative
            " @click.prevent="logoutWrapper">
        LOGOUT
      </button>
    </div>
  </div>
</template>

<script setup>
const { logout } = useAuth();
const logoutWrapper = () => {
  logout();
};
</script>

<style scoped lang="scss">
.router-link-active:after {
  background: var(--mp-coral);
  bottom: -0.3em;
  content: "";
  display: block;
  height: 0.8em;
  left: -0.3em;
  opacity: .6;
  position: absolute;
  width: calc(100% + 0.6em);
  z-index: -1;
}
</style>