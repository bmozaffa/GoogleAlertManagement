async function list_alerts(token) {
  const alerts = require("google-alerts-api");
  alerts.configure({
    cookies: token
  });

  return new Promise(((resolve, reject) => {
      alerts.sync(err => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(alerts.getAlerts());
        }
      })
    })
  );
}

async function create_alert(token, record, callback) {
  const alerts = require("google-alerts-api");
  alerts.configure({
    cookies: token
  });
  alerts.sync(() => {
    const alertToCreate = {
      howOften: alerts.HOW_OFTEN.AS_IT_HAPPENS,
      sources: alerts.SOURCE_TYPE.AUTOMATIC, // default one
      lang: 'en',
      name: record.get("Alerts Keyword"),
      region: 'any',
      howMany: alerts.HOW_MANY.BEST,
      deliverTo: alerts.DELIVER_TO.RSS,
      deliverToData: ''
    };

    alerts.create(alertToCreate, (err, alert) => {
      if (err) {
        console.log("Failed to create alert " + alertToCreate.name);
        console.log(err);
      } else {
        console.log("Created alert %s with RSS url %s", alert.name, alert.rss);
        callback(record.id, alert.rss);
      }
    });
  });
  return record;
}

async function remove_alert(token, alertId) {
  const alerts = require("google-alerts-api");
  alerts.configure({
    cookies: token
  });
  alerts.sync(() => {
    alerts.remove(alertId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Removed alert");
      }
    });
  });
}

function get_secure_token(sid, ssid, hsid) {
  if (!sid || !ssid || !hsid) {
    return undefined;
  }
  return btoa(JSON.stringify(
    [{
      key: 'SID',
      value: sid,
      domain: 'google.com'
    },
      {
        key: 'HSID',
        value: hsid,
        domain: 'google.com'
      },
      {
        key: 'SSID',
        value: ssid,
        domain: 'google.com'
      },
    ]
  ));
}

async function get_chrome_cookie(profile) {
  const chromeCookies = require('chrome-cookies-secure');
  return await chromeCookies.getCookiesPromised("https://myaccount.google.com", null, profile);
}

module.exports = {
  get_chrome_cookie, get_secure_token, list_alerts, create_alert, remove_alert
}
