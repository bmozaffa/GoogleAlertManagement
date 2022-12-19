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
    sync.sync(cookie, token);
    res.end("Will create, update, or delete Google Alerts based on Airtable records");
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
