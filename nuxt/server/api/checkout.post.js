import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = Stripe(
    'sk_test_51LHCbRHXoDOdGx5FtnRc16LiAx1o4WnXFIOr4Ak2JNhx8L8cW4qxc8Tn4W1AsQZbDAEGibUMPDOTvTweundFz6ev00ELXylahZ'
  );
  const stripePrivateApiKey = config.stripePrivateApiKey;
  const { email, cartId } = await useBody(event);

  const customer = await stripe.customers.search({
    query: 'email:\'nedas.snarskis17@gmail.com\'',
  });

  const options = {
    amount: 101,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      order_ids: '123,124,125',
      lineItems: '717454455,478845454,487874511',
    },
  }

  if(customer.data.length > 0){
    options.customer = customer.data[0].id
  }

  const paymentIntent = await stripe.paymentIntents.create(options);

  return {
    stripePrivateApiKey,
    clientSecret: paymentIntent.client_secret,
  };
});
