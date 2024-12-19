export default function useZenotiAPIs() {
    const invoiceID = useState('invoiceID', () => null);
    //https://docs.zenoti.com/reference/create-a-guest
    async function createGuest(center_id, guest_name, guest_email) {
      const request = `{
          center_id: "${center_id}",
          personal_info: {
            user_name: "${guest_name + Math.random().toString().substring(2,18)}",
            first_name: "${guest_name}",
            last_name: "${guest_name}",
            email: "${guest_email}",
            mobile_phone: {
            	country_code: 1,
            	number: 123456789
            }
          },
        }
      `;
      try {
          let response = await useZenoti("POST", "guests",  request);
          return response
      } catch {
          return {}
      }
    }

    //https://docs.zenoti.com/reference/search-for-a-guest
    async function searchGuest(center_id, guest_name,user_email) {
      const request = `{
        }
      `;
      console.log('searchRequest', `guests/search?center_id=${center_id}&first_name=${guest_name}&last_name=${guest_name}&email=${user_email}`)
      try {
          let response = await useZenoti("GET", `guests/search?center_id=${center_id}&first_name=${guest_name}&last_name=${guest_name}&email=${user_email}`,  request);
          console.log('response', response)
          return response
      } catch(err) {
        console.log('error', err)
        return {}
      }
    }
    
    //https://docs.zenoti.com/reference/add-a-creditdebit-card-for-a-guest-service-booking-and-billing
    async function addCreditCard(guest_id) {
      const  request = `{
      }`
      try {
        let response = await useZenoti("POST", `guests/${guest_id}/accounts`,  request);
        return response
      } catch {
        return ''
      }
    }
    //https://docs.zenoti.com/reference/create-an-invoice-for-the-sale-of-a-gift-card
    async function createInvoiceForGiftcard(
      center_id, 
      guest_id,
      price,
      amount,
      message
    ) {
      const  request = `{
        center_id: "${center_id}",
        guest_id: "${guest_id}",
        gift_cards: [{
          type: 0,
          code: "gift_card_${Math.random()}${Math.random()}${Math.random()}",
          custom_amount: {
            price: "${price}",
            value: ${amount}
          },
          notes: "${message}",
          expiry: {
            days: 999999
          }
        }
      }]`
      try {
        let response = await useZenoti("POST", `invoices/gift_cards`,  request);
        return response
      } catch (err){
        console.error("error in createInvoiceForGiftcard", err)
        return ''
      }
    }
    //https://docs.zenoti.com/reference/retrieve-the-saved-creditdebit-cards-of-a-guest
    async function RetrieveCreditCard(center_id, guest_id) {
      const  request = `{
      }`
      try {
        let response = await useZenoti("Get", `guests/${guest_id}/accounts?center_id=${center_id}`,  request);
        return response
      } catch {
        return ''
      }
    }
    
    //https://docs.zenoti.com/reference/collect-invoice-payment-by-using-a-guests-saved-creditdebit-card
    async function collectInvoicePaymentBySavedCreditCard(invoice_id, account_id, center_id, redirect_uri, source=0) {
      const  request = `{
        account_id: "${account_id}"
        center_id: "${center_id}",
        redirect_uri: ${redirect_uri},
        source: ${source}
      }`
      try {
        let response = await useZenoti("POST", `invoices/${invoice_id}/online_payments`,  request);
        return response
      } catch {
        return ''
      }
    }
    async function collectInvoicePaymentByUnsavedCreditCard(
      invoice_id,
      center_id,
      redirect_uri,
      source=0
    ) {
      const  request = `{
        center_id: "${center_id}",
        redirect_uri: "${redirect_uri}",
      }`
      try {
        let response = await useZenoti("POST", `invoices/${invoice_id}/online_payments`,  request);
        return response
      } catch {
        return ''
      }
    }
    //https://docs.zenoti.com/reference/close-an-invoice
    async function closeAnInvoice(
      invoice_id,
      is_invoice_closed=true,
      error=null,
      status=0,
    ) {
      const  request = `{
        is_invoice_closed: ${is_invoice_closed},
        error: ${error},
        status: ${status},
        closed_by_id: "ed903e56-36ff-425f-9257-c6f4b7d9344e"
      }`
      try {
        let response = await useZenoti("POST", `invoices/${invoice_id}/close`,  request);
        console.log('resp of invoice_close', response)
        return response
      } catch {
        return ''
      }
    }
    async function sendEmailToGuest(invoice_id) {
      const  request = `{
      }`
      try {
        let response = await useZenoti("PUT", `invoices/${invoice_id}/email`,  request);
        console.log('resp of invoice_close', response)
        return response
      } catch {
        return ''
      }
    }
    //https://docs.zenoti.com/reference/list-all-templates
    async function getlistAllTemplates(
      center_id,
      giftcardtype
    ) {
      const  request = `{
      }`
      try {
        let response = await useZenoti("GET", `giftcards/templates?center_id=${center_id}&giftcardtype=${giftcardtype}`,  request);
        console.log('resp of listAllTemplates', response)
        return response
      } catch {
        return ''
      }
    }
    //List all services of a center
    //https://docs.zenoti.com/reference/list-all-services-of-a-center
    async function getAllServicesOfCenter(
      center_id,
      catalog_enabled = true
    ) {
      const  request = `{
      }`
      try {
        let response = await useZenoti("GET", `Centers/${center_id}/services?size=100&catalog_enabled=${catalog_enabled}`,  request);
        console.log('resp of AllServicesOfCenter', response)
        return response
      } catch {
        return ''
      }
    }
    //https://documenter.getpostman.com/view/16255247/2s8YmKSPwT#786d3e4e-7bc9-4a1a-93c2-2b9c981f7bf0
    async function createGiftCardTemplateWithServices(
      center_id,
      service_id
    ) {
      const  request = `{
        center_id: "${center_id}",
        services: [
          {
            "id": "${service_id}",
            "quantity": 1
          }
        ]
      }`
      console.log('request', request)
      try {
        let response = await useZenoti("POST", `giftcards/templates/custom`,  request);
        console.log('resp of createGiftCardTemplateWithServices', response)
        return response
      } catch {
        return ''
      }
    }
    //https://documenter.getpostman.com/view/16255247/2s8YmKSPwT#17476c70-b99a-4c8e-be3f-72ce5d10e207
    async function CreateInvoiceUsingGiftcardTemplate(
      center_id,
      guest_id,
      template_id,
      message,
      recepient_name,
      recepient_email
    ) {
      const  request = `{
        center_id: "${center_id}",
        guest_id: "${guest_id}",
        "giftcards": [
          {
            "template_id": "${template_id}",
            "occassion": {
                "id": "occassion_${ Math.random().toString().substring(2,18)}",
                "message": "${message}"
            },
            "recepient": {
              "name": "${recepient_name}",
              "email": "${recepient_email}"
            }
          }
        ]
      }`
      console.log('request', request)
      try {
        let response = await useZenoti("POST", `invoices/giftcards`,  request);
        console.log('resp of createGiftCardTemplateWithServices', response)
        return response
      } catch {
        return ''
      }
    }

    return {
      invoiceID,
      createGuest,
      searchGuest,
      addCreditCard,
      createInvoiceForGiftcard,
      RetrieveCreditCard,
      collectInvoicePaymentBySavedCreditCard,
      collectInvoicePaymentByUnsavedCreditCard,
      closeAnInvoice,
      sendEmailToGuest,
      getlistAllTemplates,
      getAllServicesOfCenter,
      createGiftCardTemplateWithServices,
      CreateInvoiceUsingGiftcardTemplate
    };
  }
  