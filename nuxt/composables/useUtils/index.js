import { useStoryblokApi } from '@storyblok/vue';

export default function useUtils() {
  const storyblokApi = useStoryblokApi();
  const windowState = useState('window-state', () => {
    return { origin: process.client ? window.origin : '' };
  });

  const FULFILLMENT_STATUS = {
    ATTEMPTED_DELIVERY: 'Attempted delivery',
    CANCELED: 'Canceled',
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    FAILURE: 'Failure',
    FULFILLED: 'Fulfilled',
    IN_PROGRESS: 'In Progress',
    IN_TRANSIT: 'In transit',
    LABEL_PRINTED: 'Label printed',
    LABEL_PURCHASED: 'Label purchased',
    LABEL_VOIDED: 'Label voided',
    MARKED_AS_FULFILLED: 'Marked as fulfilled',
    NOT_DELIVERED: 'Not delivered',
    ON_HOLD: 'On Hold',
    OPEN: 'Open',
    OUT_FOR_DELIVERY: 'Out for delivery',
    PARTIALLY_FULFILLED: 'Partially Fulfilled',
    PENDING_FULFILLMENT: 'Pending',
    PICKED_UP: 'Displayed as Picked up',
    READY_FOR_PICKUP: 'Ready for pickup',
    RESTOCKED: 'Restocked',
    SCHEDULED: 'Scheduled',
    SUBMITTED: 'Submitted',
    UNFULFILLED: 'Unfulfilled',
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function decodeFinancialStatus(fulfillmentStatus) {
    return capitalizeFirstLetter(fulfillmentStatus).replaceAll('_', ' ');
  }

  function money(priceV2, useAccuratePrice = false) {
    let { amount, currencyCode } = priceV2;
    const { currency } = useCurrency();
    if (currency.value) {
      currencyCode = currency.value == 'US' ? 'USD' : currency.value == 'CA' ? 'CAD' : ''
    }
    switch (currencyCode) {
      case 'USD':
        return `$${useAccuratePrice ? parseFloat(amount).toFixed(2) : parseInt(amount)}`;
      case 'CAD':
        return `$${useAccuratePrice ? parseFloat(amount).toFixed(2) : parseInt(amount)}` + ' CAD';
      default:
        return 'Given currency is not supported';
    }
  }

  function moneyWithCurrency(priceV2) {
    const { amount, currencyCode } = priceV2;

    switch (currencyCode) {
      case 'USD':
        return `$${amount} USD`;
      case 'CAD':
        return `$${amount} CAD`;
      default:
        return 'Given currency is not supported';
    }
  }

  function richText(content) {
    return storyblokApi.richTextResolver.render(content);
  }

  function isImage(url) {
    //test that the Asset URL contains an image file extension, returns true.
    return /\.(jpg|jpeg|JPG|JPEG|png|PNG|webp|WEBP|avif|AVIF|gif|GIF|svg|SVG)$/.test(
      url
    );
  }

  function isVideo(url) {
    //test that the Asset URL contains an video file extension, returns true.
    return /\.(mp4|MP4|ogg|OGG|mov|MOV|wmv|WMV|avi|AVI|avchd|AVCHD|webm|WEBM|html5|HTML5)$/.test(url);
  }
  function kebabCase(str) {
    return str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .join('-')
      .toLowerCase();
  }
  function convertToSlug(string) {
    return string
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[-]+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  return {
    capitalizeFirstLetter,
    decodeFinancialStatus,
    moneyWithCurrency,
    money,
    isImage,
    isVideo,
    kebabCase,
    FULFILLMENT_STATUS,
    richText,
    convertToSlug,
    windowState,
  };
}
