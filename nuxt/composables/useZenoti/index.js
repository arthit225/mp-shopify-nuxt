import { reactive } from 'vue';

export default async function useZenoti(method, command, req) {
  const config = useRuntimeConfig();
  const zenotiApiKey = config.public.zenotiApiKey;
  const zenotiApiUrl = config.public.zenotiApiUrl;
  const dataResponse = reactive({})

  dataResponse.refresh = async() => {
    try {
      const resp = await $fetch(
        `${zenotiApiUrl}/${command}`,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${zenotiApiKey}`,
          },
          body: (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") ? null : req,
        }
      );
  
      console.log('zenoti resp', resp);
      dataResponse.data = resp;
      dataResponse.errors = null; // usually admin error, not user created
  
      return dataResponse;
    } catch (err) {
      console.error("Error", err);
      dataResponse.data = null
      dataResponse.errors = [{ message: err.message }]
      return dataResponse;
    }
  }

  try {
    console.log('zenotiApiKey', zenotiApiKey, 'req', req, 'method', method , 'command', command)
    const resp =  await $fetch(
        `${zenotiApiUrl}/${command}`,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${zenotiApiKey}`,
          },
          body: (method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD") ? null : req,
        }
      ) 

    console.log('zenoti resp', resp);
    dataResponse.data = resp;
    dataResponse.errors = null; // usually admin error, not user created

    return dataResponse;
  } catch (err) {
    console.error(err);
    dataResponse.data = null
    dataResponse.errors = [{ message: err.message }]
    return dataResponse;
  }

}
