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
  const batchPromises = [];
  for (let index = 0; index < (records.length / 10); index++) {
    const start = (index * 10);
    const end = Math.min(start + 10, records.length);
    const slice = records.slice(start, end);
    batchPromises.push(new Promise((resolve, reject) => {
      if (slice.length === 0) {
        resolve([]);
      } else {
        airTableBase('Google Alerts Keywords').update(slice, function (err, records) {
          if (err) {
            console.error(err, err.stack);
            reject(err);
          } else {
            resolve(records);
          }
        });
      }
    }));
  }
  return Promise.allSettled(batchPromises);
}

module.exports = {
  configure, get_alert_rows, update_alerts
};
