<template>
  <div class="layout">
    <layout-the-sidebar-menu />
    <TheCart />
    <TheGiftCart />
    <AnnouncementBar />
    <TheHeader />
    <slot />  
    <HomeInstagram/>
    <SpotifyPlayer />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
import TheCart from '~~/components/layout/TheCart.vue'
import AnnouncementBar from '~~/components/layout/TheAnnouncementBar.vue'
import TheGiftCart from '~~/components/layout/TheGiftCart.vue'
export default {
  components: { TheHeader, TheFooter, TheCart, AnnouncementBar, TheGiftCart },
  mounted() {
    /* Userback */
    if(window.location.host === 'lionfish-app-etfq2.ondigitalocean.app'|| window.location.host.includes('localhost') || window.location.host === 'sea-lion-app-bom97.ondigitalocean.app') {
      window.Userback = window.Userback || {};
      Userback.access_token = '30151|70659|aY0LaYf1FiBxN0XEH36M3VDBP';
      (function(d) {
          var s = d.createElement('script');s.async = true;
          s.src = 'https://static.userback.io/widget/v1.js';
          (d.head || d.body).appendChild(s);
      })(document);
    }
    /* End Userback */

    const b = document.body
    const dist = 34 //height of header

    window.addEventListener('scroll', function(){
      var scrolled = window.scrollY
      if(scrolled > dist) {
        b.classList.add('scrolled')
      }
      else {
        b.classList.remove('scrolled')
      }
    })

  },
}
</script>