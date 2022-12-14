var Airtable = require('airtable');
var airTableBase;

function configure(apiKey, baseId) {
  airTableBase = new Airtable({apiKey: apiKey}).base(baseId);
}

async function get_alert_rows() {
  const records = await airTableBase('Google Alerts Keywords').select({view: "Grid view"}).all();
  console.log("Found " + records.length + " records in airtable")
  return records;
}

async function update_alert(recordId, rss) {
  airTableBase('Google Alerts Keywords').update([
    {
      "id": recordId,
      "fields": {
        "RSS Feed": rss
      }
    }
  ], function(err) {
    if (err) {
      console.error(err);
    }
  });
}

async function update_alerts(objects) {
  var records = [];
  for (object of objects) {
    records.push({
      id: object.id,
      fields: {
        "RSS Feed": object.get("RSS Feed")
      }
    });
  }
  airTableBase('Google Alerts Keywords').update(records, function(err) {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  configure, get_alert_rows, update_alerts, update_alert
};
