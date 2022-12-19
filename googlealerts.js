const alerts = require("google-alerts-api");

async function list_alerts(token) {
  alerts.configure({
    cookies: token
  });
  return new Promise(((resolve, reject) => {
      alerts.sync(err => {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        } else {
          resolve(alerts.getAlerts());
        }
      })
    })
  );
}

async function create_alert(token, record) {
  alerts.configure({
    cookies: token
  });
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
  return new Promise((resolve, reject) => {
    alerts.sync(() => {
      alerts.create(alertToCreate, (err, alert) => {
        if (err) {
          console.log("Failed to create alert " + alertToCreate.name);
          console.error(err, err.stack);
          reject(err);
        } else {
          console.log("Created alert %s with RSS url %s", alert.name, alert.rss);
          resolve({
            "recordId": record.id,
            "rss": alert.rss
          });
        }
      });
    });
  });
}

async function remove_alert(token, alertId) {
  alerts.configure({
    cookies: token
  });
  return new Promise((resolve, reject) => {
    alerts.sync(() => {
      alerts.remove(alertId, (err) => {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        } else {
          console.log("Removed alert " + alertId);
          resolve(alertId);
        }
      });
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

module.exports = {
  get_secure_token, list_alerts, create_alert, remove_alert
}
