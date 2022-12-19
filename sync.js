console.log("Running...");
const baseId = "app9RtRrw9rTjgbUZ";
// const baseId = "appdpBAn1QPm2n9Jw";

function sync(cookie, token) {
  const alerts = require("./googlealerts");
  Promise.all([desired_alerts(token), alerts.list_alerts(cookie)]).then((alertResults) => {
    var comparison = compare_alerts(alertResults[0], alertResults[1]);
    console.log("Will delete %s records, create %s records, and update %s records", comparison.delete.length, comparison.create.length, comparison.update.length);
    for (alert of comparison.delete) {
      alerts.remove_alert(cookie, alert.id);
    }
    if (comparison.update.length > 0) {
      update_alerts(token, comparison.update);
    }
    for (record of comparison.create) {
      alerts.create_alert(cookie, record, (recordId, rss)=>{
        console.log("Created alert and will update record %s with %s", recordId, rss);
        update_alert(token, recordId, rss);
      });
    }
    console.log("Completed running sync script");
  }).catch(function(err) {
    console.error(err, err.stack);
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

async function update_alert(token, recordId, rss) {
  const airtable = require("./airtable.js");
  airtable.configure(token, baseId);
  // airtable.configure(getAirtableToken(), 'app9RtRrw9rTjgbUZ');
  return airtable.update_alert(recordId, rss);
}

async function update_alerts(token, records) {
  const airtable = require("./airtable.js");
  airtable.configure(token, baseId);
  // airtable.configure(getAirtableToken(), 'app9RtRrw9rTjgbUZ');
  return airtable.update_alerts(records);
}

module.exports = {
  sync
}