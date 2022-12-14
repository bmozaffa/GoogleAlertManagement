const http = require("http");
const {URL} = require('url');
const host = "0.0.0.0";

const requestListener = function (req, res) {
  const params = new URL(`http://${req.headers.host}${req.url}`).searchParams;
  res.writeHead(200);
  var sid = params.get("sid");
  var ssid = params.get("ssid");
  var hsid = params.get("hsid");
  var token = params.get("token");
  if (sid && ssid && hsid && token) {
    const alerts = require("./googlealerts");
    var cookie = alerts.get_secure_token(sid, ssid, hsid);
    const sync = require("./sync");
    sync.sync(cookie, token);
    res.end("Will create, update, or delete Google Alerts based on Airtable records");
  } else {
    res.end("Did not receive sid, ssid, and hsid parameters so cannot authenticate against google alerts and/or Airtable");
  }
};

const port = parseInt(process.env.PORT) || 8080;
const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
