const sync = require("./sync");
const alerts = require("./googlealerts");

// get_google_cookie().then(cookie => {
//   sync.sync(cookie, get_airtable_token());
// });

var token = alerts.get_secure_token("RAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.", "A_xxxxxxxxxxxxxxx", "Axxxxxxxxxxxxxxxx");
sync.sync(token, get_airtable_token())

async function get_google_cookie() {
  var cookies = await alerts.get_chrome_cookie("Profile 8");
  return alerts.get_secure_token(cookies.SID, cookies.SSID, cookies.HSID);
}

function get_airtable_token() {
  return "path4oTxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
}