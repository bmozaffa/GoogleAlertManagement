const sync = require("./sync");
const alerts = require("./googlealerts");

var token = alerts.get_secure_token("RAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.", "A_xxxxxxxxxxxxxxx", "Axxxxxxxxxxxxxxxx");
sync.sync(token, get_airtable_token())

// get_chrome_cookie().then(cookies => {
//   sync.sync(alerts.get_secure_token(cookies.SID, cookies.SSID, cookies.HSID), get_airtable_token());
// });
//
// async function get_chrome_cookie() {
//   const chromeCookies = require("chrome-cookies-secure");
//   return chromeCookies.getCookiesPromised("https://myaccount.google.com", null, "Profile 8");
// }

function get_airtable_token() {
  return "path4oTxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
}
