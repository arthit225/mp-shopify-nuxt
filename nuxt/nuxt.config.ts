import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',      
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ],      
      script: [

        {
          src: 'https://smartbotui-ca.simplified.io/widget/smartbot.js'
        },
        {
          src: 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=UnAsaA',
          async: true
        },
        {
          src: "https://www.googletagmanager.com/gtag/js?id=UA-53102735-1",
          async: true
        },
        {
          hid: 'gtm',
          children: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GTM-PZ37ZR2');`,
          type: 'text/javascript'
        }
      ]      
    }  
  },
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/style-resources',
    ['@storyblok/nuxt',
      {
        accessToken: 'rIloo4LQBE5BtdyWjjqIrQtt',
        cacheProvider: 'memory',
      }],
  ],
  css: [
    '@/assets/css/base/fonts.scss',
    '@/assets/css/base/colors.scss',
    '@/assets/css/base/global.scss',
    '@/assets/css/base/buttons.scss',
    '@/assets/css/base/inputs.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/base/_mixins.scss";',
        },
      },
    },
  },
  modules: ['nuxt-jsonld'],
  runtimeConfig: {
    port: +process.env.NUXT_PORT || 3002,
    klaviyoPrivateAPIKey: process.env.NUXT_KLAVIYO_PRIVATE_API_KEY || 'null',
    shopifyAdminApiAccessToken:
      process.env.NUXT_SHOPIFY_ADMIN_API_ACCESS_TOKEN || 'null',
    stripePrivateApiKey: process.env.NUXT_STRIPE_PRIVATE_API_KEY || 'null',
    shopifyAdminApiUrl: process.env.NUXT_SHOPIFY_ADMIN_API_URL || 'null',
    public: {
      shopifyStorefrontAccessToken:
        process.env.NUXT_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'null',
      shopifyStorefrontApiEndpoint:
        process.env.NUXT_SHOPIFY_STOREFRONT_URL || 'null',
      stripePublicApiKey: process.env.NUXT_STRIPE_PUBLIC_API_KEY || 'null',
      instagramAccessToke:process.env.NUXT_INSTAGRAM_ACCESS_TOKEN,
      zenotiApiKey: process.env.NUXT_ZENOTI_API_KEY,
      zenotiApiUrl: process.env.NUXT_ZENOTI_API_URL,
      websiteHost: process.env.NUXT_WEBSITE_HOST,
    },
  },
});
