export default function useRecharge() {

  async function getCustomerByEmail(email) {
    try {
      const request = await $fetch(
        `https://api.rechargeapps.com/customers?email=${email}`,
        {
          method: 'GET',
          headers: {
            'X-Recharge-Access-Token': 'sk_1x1_48d275367baef779919dbb8055f9bafebe6b12ee0f08ef1a790c8195cb87ffbe'
          }
        }
      )
  
      const response = request.customers;  
      console.log(response)
      return response;

    } catch (err) {
      return err;
    }
  }


  //Return all functions.
  return {
    getCustomerByEmail
  }
}