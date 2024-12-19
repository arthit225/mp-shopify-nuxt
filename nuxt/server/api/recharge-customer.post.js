export default defineEventHandler(async (event) => {

  const body = await useBody(event)
  const email = body.email

  const theHeaders = {
    'X-Recharge-Access-Token': 'sk_1x1_48d275367baef779919dbb8055f9bafebe6b12ee0f08ef1a790c8195cb87ffbe'
  }

  // ** Get the Recharge customer by email address.
  const requestRechargeCustomer = await $fetch(
    `https://api.rechargeapps.com/customers?email=${email}`, {
      method: 'GET',
      headers: theHeaders
    }
  )
  const result = requestRechargeCustomer.customers;
  const customerID = result[0].id;


  /*
    ** Now we have the Recharge customer ID, we can retrive all their ORDERS.
    ** Currently not needed to be used.
    const requestRechargeCustomerOrders = await $fetch(
      `https://api.rechargeapps.com/orders?customer_id=${customerID}`, {
        method: 'GET',
        headers: theHeaders
      }
    )
    const orders = requestRechargeCustomerOrders.orders
  */

  // ** Now we have the Recharge customer ID, we can retrive all their SUBSCRIPTIONS
  const requestRechargeCustomerSubscriptions = await $fetch(
    `https://api.rechargeapps.com/subscriptions?customer_id=${customerID}`, {
      method: 'GET',
      headers: theHeaders
    }
  )
  const subscriptions = requestRechargeCustomerSubscriptions.subscriptions


  return {
    subscriptions: subscriptions
  }

})