export default function useZenotiUtils() {
    function priceString(priceInfo, useAccuratePrice = false) {
      let { sale_price, currency_id } = priceInfo;
      switch (currency_id) {
        case 'xx':
          return `$${useAccuratePrice ? parseFloat(sale_price).toFixed(2) : parseInt(sale_price)}` + ' CAD';
        default:
          return `$${useAccuratePrice ? parseFloat(sale_price).toFixed(2) : parseInt(sale_price)}`;
      }
    }
    return {
      priceString
    };
  }
  