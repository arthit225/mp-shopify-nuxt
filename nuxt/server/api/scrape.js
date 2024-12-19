export default defineEventHandler(async (event) => {
  // const res = []
  const userInfoSource = await $fetch('https://www.instagram.com/majestyspleasure/')


  return  {userInfoSource}

})
