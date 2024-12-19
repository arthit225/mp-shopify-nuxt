import Cookies from 'js-cookie';

export default function useAuth(isClientSide) {
  const isAuthenticated = useState('isAuthenticated', () => false);
  const token = useState('token', () => null);
  const tokenExpiresAt = useState('tokenExpiresAt', () => null);

  return { login, logout, isAuthenticated, register, autoLogin, token };

  // -------------------------
  // Code runs only above this, everything below is just functions that are being returned above
  // -------------------------

  async function autoLogin() {
    let shopifyAccessToken = null;
    let shopifyAccessTokenExpiresAt = null;

    if (isClientSide) {
      // retrieve cookies from the client (browser)
      shopifyAccessToken = Cookies.get('shopifyAccessToken');
      shopifyAccessTokenExpiresAt = Cookies.get('shopifyAccessTokenExpiresAt');
    } else {
      // retrieve cookies from the server
      const nuxtApp = useNuxtApp();
      const cookies = nuxtApp.ssrContext.req.headers.cookie;

      // checking if cookies exist
      if (cookies && cookies.length > 0) {
        const cookiesArray = cookies.split('; ');
        cookiesArray.forEach((cookie) => {
          const [cookieName, cookieValue] = cookie.split('=');
          switch (cookieName) {
            case 'shopifyAccessToken':
              shopifyAccessToken = cookieValue;
              break;
            case 'shopifyAccessTokenExpiresAt':
              shopifyAccessTokenExpiresAt = cookieValue;
              break;
          }
        });
      }
    }

    // if we got the cookies successfully and it is not expired - authenticate user
    if (shopifyAccessToken && shopifyAccessTokenExpiresAt) {
      token.value = shopifyAccessToken;
      tokenExpiresAt.value = shopifyAccessTokenExpiresAt;
      const expiresAt = new Date(shopifyAccessTokenExpiresAt);
      const expiresIn = expiresAt - Date.now();
      if (expiresIn > 600) {
        const query = `
          query {
            customer(customerAccessToken: "${shopifyAccessToken}") {
              id
            }
          }
        `;
        // making sure that the access token is valid (validating with shopify)
        const { data, errors } = await useShopify({ query });
        if((errors && errors.length > 0) || !data.customer){
          //
          isAuthenticated.value = false;
        } else if(data && data.customer) {
          isAuthenticated.value = true;
          if (process.client && expiresIn < 1440000) {
            setTimeout(logout, expiresIn);
          }
        }

      }
    }
  }

  async function login(email, password) {
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        email: `${email}`,
        password: `${password}`,
      },
    };

    const { data, errors } = await useShopify({ query, variables });
    const tokenObject = data.customerAccessTokenCreate.customerAccessToken;
    const allErrors = data.customerAccessTokenCreate.customerUserErrors;

    if (tokenObject) {
      const newToken = tokenObject.accessToken;
      const newTokenExpiresAt = tokenObject.expiresAt;

      Cookies.set('shopifyAccessToken', newToken);
      Cookies.set('shopifyAccessTokenExpiresAt', newTokenExpiresAt);
      localStorage.setItem('shopifyAccessToken', newToken);
      localStorage.setItem('shopifyAccessTokenExpiresAt', newTokenExpiresAt);
      token.value = newToken;
      tokenExpiresAt.value = newTokenExpiresAt;
      isAuthenticated.value = true;

      return {
        success: true,
        errors: [],
      };
    } else {
      const modifiedErrors = allErrors.map((error) => {
        switch (error.code) {
          case 'UNIDENTIFIED_CUSTOMER':
            error.modifiedError =
              'Your email address or password is incorrect.';
            return error;
          default:
            error.modifiedError = 'There was an error, please try again.';
            return error;
        }
      });
      return {
        success: false,
        errors: modifiedErrors,
      };
    }
  }

  function logout() {
    const { $router } = useNuxtApp();
    Cookies.remove('shopifyAccessToken');
    Cookies.remove('shopifyAccessTokenExpiresAt');
    localStorage.removeItem('shopifyAccessToken');
    localStorage.removeItem('shopifyAccessTokenExpiresAt');
    isAuthenticated.value = false;
    $router.push('/auth/login');
  }

  async function register(formData) {
    const { firstName, lastName, email, password, phone, acceptsMarketing, dateOfBirth } = formData;
    const { data, errors } = await $fetch('/api/register', {
      method: 'POST',
      body: {
        firstName,
        lastName,
        email,
        password,
        phone,
        acceptsMarketing
      },
    });
    return {
      data: data,
      errors: errors,
    };
  }
}
