const http = require("http");
const {URL} = require('url');
const fs = require('fs');
const sync = require("./sync");
const alerts = require("./googlealerts");

const requestListener = function (req, res) {
  const params = new URL(`http://${req.headers.host}${req.url}`).searchParams;
  res.writeHeader(200, {"Content-Type": "text/html"});
  var sid = params.get("sid");
  var ssid = params.get("ssid");
  var hsid = params.get("hsid");
  var token = params.get("token");
  if (sid && ssid && hsid && token) {
    var cookie = alerts.get_secure_token(sid, ssid, hsid);
    sync.sync(cookie, token).then(operations => {
      const failures = operations.addFailed.length + operations.removeFailed.length + operations.updateFailed.length;
      if (failures > 0) {
        res.write("Failed " + failures + " operations!");
        res.write("<br/>")
        for (addFail of operations.addFailed) {
          res.write(addFail);
          res.write("<br/>")
        }
        for (removeFail of operations.removeFailed) {
          res.write(removeFail);
          res.write("<br/>")
        }
        for (updateFail of operations.updateFailed) {
          res.write(updateFail);
          res.write("<br/>")
        }
      }
      if ((failures + operations.added.length + operations.removed.length + operations.updated.length) === 0) {
        res.write("Airtable and Google Alerts are in sync. There is nothing to do!");
        res.write("<br/>")
      }
      for (record of operations.added) {
        res.write("Added new alert with RSS Feed url " + record.rss);
        res.write("<br/>")
      }
      for (record of operations.removed) {
        res.write("Delete obsolete alert  " + record);
        res.write("<br/>")
      }
      for (batch of operations.updated) {
        for (record of batch) {
          res.write("Updated RSS feed in Airtable for " + record.get("Alerts Keyword"));
          res.write("<br/>")
        }
      }
      res.write("<p/>")
      res.end("Finished reconciling table with Google Alerts")
    }).catch(function (err) {
      console.error(err, err.stack);
      res.write("Error processing changes!");
      res.write("<br/>")
      res.end(err);
    });
  } else {
    const html = fs.readFileSync("./form.html");
    res.end(html);
  }
};

const port = parseInt(process.env.PORT) || 8080;
const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
