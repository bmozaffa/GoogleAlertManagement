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

async function update_alerts(records) {
  return new Promise((resolve, reject) => {
    if (records.length === 0) {
      resolve([]);
    } else {
      airTableBase('Google Alerts Keywords').update(records, function (err, records) {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        } else {
          resolve(records);
        }
      });
    }
  });
}

module.exports = {
  configure, get_alert_rows, update_alerts
};
