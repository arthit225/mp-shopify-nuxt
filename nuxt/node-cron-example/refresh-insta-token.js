const cron = require('node-cron');
const fetch = require('node-fetch');

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
  
 console.log('running a task every minute');
 const url = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=IGQVJWZAlBTUWFoajVab2NiZAWppbm9hYk52eFJGdzJZAbnVEUUVUbS1pWE5HWE9XbFQtTVdGVEJodm5nRGVqMmNFbXRlZA09kaWw3TjhsMFBBVlg0QzQ1eVJTLTkyVXlLZAGVyZAEZAlTzBTeng3blAxaHlndAZDZD';

 fetch(url)
  .then(res => res.text())
  .then(text => console.log(text));

});
