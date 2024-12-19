export default function useCurrency() {

  const currency = useCookie("currency", { maxAge: 60 * 60 * 24 });
  
  /*Force it to be set as CA*/
  // if(!currency.value) {
  //   currency.value = 'CA'
  // }


  function setCurrency(value){
    return currency.value = value    
  }
  
  return {
    currency,
    setCurrency
  }

}
