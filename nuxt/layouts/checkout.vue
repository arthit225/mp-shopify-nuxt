<template>
  <div class="layout">
    <LayoutTheCart />
    <slot />
  </div>
</template>

<script>
export default {
  mounted() {
    /* Userback */
    window.Userback = window.Userback || {};
    Userback.access_token = '30151|70659|aY0LaYf1FiBxN0XEH36M3VDBP';
    (function(d) {
        var s = d.createElement('script');s.async = true;
        s.src = 'https://static.userback.io/widget/v1.js';
        (d.head || d.body).appendChild(s);
    })(document);
    /* End Userback */
  },
}
</script>