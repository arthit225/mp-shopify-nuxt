export default defineNuxtRouteMiddleware(async(to, from) => {
  const {$router} = useNuxtApp()
  const {isAuthenticated, autoLogin} = useAuth()
  if(process.server && isAuthenticated.value === false){
    await autoLogin()
  }

  if(!isAuthenticated.value){
    $router.push({name: 'auth-login'})
  }
})