console.log("Running...");
// const baseId = "app9RtRrw9rTjgbUZ";
const baseId = "appdpBAn1QPm2n9Jw";

function sync(cookie, token) {
  const alerts = require("./googlealerts");
  return new Promise((resolve, reject) => {
    Promise.all([desired_alerts(token), alerts.list_alerts(cookie)]).then((alertResults) => {
      const operations = {
        added: [],
        updated: [],
        removed: [],
        addFailed: [],
        updateFailed: [],
        removeFailed: [],
      };
      const comparison = compare_alerts(alertResults[0], alertResults[1]);
      console.log("Will delete %s records, create %s records, and update %s records", comparison.delete.length, comparison.create.length, comparison.update.length);
      alerts.create_alerts(cookie, comparison.create).then(creations => {
        for (creation of creations) {
          if (creation.status === 'fulfilled') {
            operations.added.push(creation.value);
          } else {
            operations.addFailed.push(creation.value);
          }
        }
        const deletesPromised = alerts.remove_alerts(cookie, comparison.delete);
        const updatesPromised = update_alerts(token, comparison.update, operations.added);
        Promise.allSettled([deletesPromised, updatesPromised]).then(results => {
          if (results[0].status === 'fulfilled') {
            for (deleted of results[0].value) {
              if (deleted.status === 'fulfilled') {
                operations.removed.push(deleted.value);
              } else {
                operations.removeFailed.push(deleted.value);
              }
            }
          } else {
            operations.removeFailed.push(results[0].value);
          }
          if (results[1].status === 'fulfilled') {
            for (record of results[1].value) {
              operations.updated.push(record);
            }
          } else {
            operations.updateFailed.push(true);
          }
          resolve(operations);
        });
      }).catch(function (err) {
        console.error(err, err.stack);
        reject(err);
      });
    }).catch(function (err) {
      console.error(err, err.stack);
      reject(err);
    });
  });
}

function compare_alerts(records, alerts) {
  var comparison = {
    create: [],
    delete: [],
    update: [],
  };
  outer: for (record of records) {
    for (alert of alerts) {
      if (record.get("Alerts Keyword") === alert.name) {
        if (!record.get("RSS Feed")) {
          record.set("RSS Feed", alert.rss);
          comparison.update.push(record);
        }
        continue outer;
      }
    }
    if (record.get("Alerts Keyword") && record.get("Alerts Keyword").length > 0) {
      comparison.create.push(record);
    }
  }
  outer: for (alert of alerts) {
    for (record of records) {
      if (record.get("Alerts Keyword") === alert.name) {
        continue outer;
      }
    }
    comparison.delete.push(alert);
  }
  return comparison;
}

async function desired_alerts(token) {
  const airtable = require("./airtable.js");
  airtable.configure(token, baseId);
  // airtable.configure(token, 'app9RtRrw9rTjgbUZ');
  return airtable.get_alert_rows();
}

async function update_alerts(token, updates, newFeeds) {
  var records = [];
  for (object of newFeeds) {
    records.push({
      id: object.recordId,
      fields: {
        "RSS Feed": object.rss
      }
    });
  }
  for (object of updates) {
    records.push({
      id: object.id,
      fields: {
        "RSS Feed": object.get("RSS Feed")
      }
    });
  }
  const airtable = require("./airtable.js");
  airtable.configure(token, baseId);
  return airtable.update_alerts(records);
}

module.exports = {
  sync
}