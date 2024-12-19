export default function useGiftCart() {
  const isGiftCartOpen = useState('isGiftCartOpen', () => false);
  const isReadyToCheckout = useState('isReadyToCheckout', () => false);
  const giftingCarts = useState('giftingCarts', () => []);
  const giftingCartIds = useState('giftingCartIds', () => []);
  const giftingCartsCount = useState('giftingCartsCount', () => 0);
  const giftingMessage = useState('giftingMessage', () => '');
  const giftingProductList = useState('giftingProductList', () => []);
  const giftingPackingList = useState('giftingPackingList', () => []);
  const giftingPackaging = useState('giftingPackaging', () => null)
  const giftingBestSellers = useState('giftingBestSellers', () => []);
  return {
    isGiftCartOpen,
    isReadyToCheckout,
    toggleGiftCart,
    openGiftCart,
    closeGiftCart,
    giftingCarts,
    giftingCartIds,
    giftingCartsCount,
    giftingMessage,
    giftingProductList,
    giftingPackaging,
    giftingPackingList,
    giftingBestSellers
  };

  function toggleGiftCart() {
    isGiftCartOpen.value = !isGiftCartOpen.value;
  }
  function openGiftCart() {
    console.log('isGiftCartOpen', isGiftCartOpen.value)
    isGiftCartOpen.value = true;
  }
  function closeGiftCart() {
    isGiftCartOpen.value = false;
    console.log('closeGiftCart')
  }
}
