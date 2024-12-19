export default defineEventHandler(async (event) => {

  const body = await useBody(event)
  const id = body.id

  const theHeaders = {
    'X-Recharge-Access-Token': 'sk_1x1_48d275367baef779919dbb8055f9bafebe6b12ee0f08ef1a790c8195cb87ffbe'
  }

  // ** Delete the subscription usign its ID.
  const cancelSubscription = await $fetch(
    `https://api.rechargeapps.com/subscriptions/${id}`, {
      method: 'DELETE',
      headers: theHeaders
    }
  )
  const result = cancelSubscription

  return { result : result }

})