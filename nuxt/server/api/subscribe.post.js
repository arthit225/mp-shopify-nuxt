export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const klaviyoPrivateAPIKey = config.klaviyoPrivateAPIKey;
  const { email, listID } = await useBody(event);

  if (!email)
    return {
      success: false,
      message: 'Please provide email address',
    };

  if (!listID)
    return { success: false, message: 'Please provide listID' };

  const {success, message} = await subscribeList(
    {
      email,
      listID,
    },
    klaviyoPrivateAPIKey
  );

  return {
    success,
    message
  }
});

async function subscribeList(formData, privateKey) {
  const { email, listID } = formData;
  let success = false;
  let message = '';
  try {
    const response = await $fetch(
      `https://a.klaviyo.com/api/v2/list/${listID}/subscribe?api_key=${privateKey}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          "profiles": [{ "email": email }]
        },
      }
    );
    
    if(response.length === 0){
      message = "If you haven't already subscribed, please check your email and confirm in order to subscribe to our newsletter."
      success = true
    } else if(response.length > 0){
      message = 'Thank you for subscribing!'
      success = true
    }
  } catch (err) {
    console.error(err);
    success = false
    message = 'Something went wrong, please refresh the page and try again.'
  }

  return {success, message};
}
