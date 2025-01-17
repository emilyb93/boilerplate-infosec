const express = require("express");
const app = express();
//
const {
  hidePoweredBy,
  frameguard,
  xssFilter,
  noSniff,
  ieNoOpen,
  hsts,
  dnsPrefetchControl,
  noCache,
  contentSecurityPolicy,
} = require("helmet");

const ninetyDaysInSeconds = 60 * 60 * 24 * 90;
const helmetMiddleware = [
  hidePoweredBy(),
  frameguard({ action: "deny" }),
  xssFilter(),
  noSniff(),
  ieNoOpen(),
  hsts({ maxAge: ninetyDaysInSeconds, force: true }),
  dnsPrefetchControl(),
  noCache(),
  contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  }),
];
app.use(...helmetMiddleware);
//

module.exports = app;
const api = require("./server.js");
app.use(express.static("public"));
app.disable("strict-transport-security");
app.use("/_api", api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
