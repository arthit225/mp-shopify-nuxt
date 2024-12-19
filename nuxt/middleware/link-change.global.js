export default defineNuxtRouteMiddleware((to, from) => {
  const {closeSidebar} = useSidebar();
  const {closeMiniCart} = useCart();
  const { currency } = useCurrency();

  //console.log("ROROROROORORORORORO", JSON.stringify(to.path), currency.value);

  const p = to.path
  //All old redirects

  //If in USA, redirect pages to /us
  if (
    ( currency.value == "US" && p == "/membership/") ||
    ( currency.value == "US" && p == "/membership")
  ){
    return navigateTo("/membership/us");
  }
  if (
    (currency.value == "CA" && p == "/membership/us/") ||
    (currency.value == "CA" && p == "/membership/us")
  ) {
    return navigateTo("/membership");
  }
  if (
    (currency.value == "US" && p == "/faq/") ||
    (currency.value == "US" && p == "/faq")
  ) {
    return navigateTo("/faq-us");
  }
  if (
    (currency.value == "CA" && p == "/faq-us/") ||
    (currency.value == "CA" && p == "/faq-us")
  ) {
    return navigateTo("/faq");
  }


  if (p == "/frequently-asked-questions"||
    p == "/frequently-asked-questions/") {
    return navigateTo('/faq')
  }
  if (p == "/at-home" || p == "/at-home/") {
    return navigateTo('/shop')
  }    
  if (p == "/services" || p == "/services/") {
    return navigateTo('/book')
  }   
  if (p == "/blogs" || p == "/blogs/") {
    return navigateTo('/the-dose')
  }  
  if (p == "/privacy-policy-2" || p == "/privacy-policy-2/") {
    return navigateTo('/privacy-policy')
  }  
  if (p == "/shipping-policy-2" || p == "/shipping-policy-2/") {
    return navigateTo('/shipping-delivery')
  }  
  if (p == "/billing-terms-and-conditions"||p == "/billing-terms-and-conditions/") {
    return navigateTo('/terms-and-conditions')
  }  
  if (p == "/returns" || p == "/returns/") {
    return navigateTo('/shipping-delivery')
  }  
  if (p == "/contact-us" || p == "/contact-us/") {
    return navigateTo('/contact')
  }
  if (p == "/what-is-mindfulness-and-how-can-i-achieve-it/" || p == "/what-is-mindfulness-and-how-can-i-achieve-it") {
    return navigateTo('/the-dose')
  }

  if(process.client) {
    // Nuxt's navigateTo wont work for an external URL, so do it client side.
    if ((p == "/gift-card") && !to?.query?.test) {
      alert(":dd")
      //window.location.href = "https://majestyspleasure.zenoti.com/webstoreNew/services"
    }

    closeSidebar()
    closeMiniCart()
  };
})