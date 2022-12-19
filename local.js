const sync = require("./sync");
const alerts = require("./googlealerts");

var token = alerts.get_secure_token("RAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.", "A_xxxxxxxxxxxxxxx", "Axxxxxxxxxxxxxxxx");
sync.sync(token, get_airtable_token()).then(operations => {
  const failures = operations.addFailed.length + operations.removeFailed.length + operations.updateFailed.length;
  if (failures > 0 ){
    console.error("Failed " + failures + " operations!");
    for (addFail of operations.addFailed) {
      console.error(addFail);
    }
    for (removeFail of operations.removeFailed) {
      console.error(removeFail);
    }
    for (updateFail of operations.updateFailed) {
      console.error(updateFail);
    }
  }
  for (record of operations.added) {
    console.log("Added new alert with RSS Feed url " + record.rss);
  }
  for (record of operations.removed) {
    console.log("Delete obsolete alert  " + record);
  }
  for (record of operations.updated) {
    console.log("Updated RSS feed in Airtable for " + record.get("Alerts Keyword"));
  }
});

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
