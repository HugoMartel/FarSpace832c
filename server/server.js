/**
 * @file Main page of the project, start the webserver by executing it
 * @author Stratego Online
 * @version 1.0
 */

//****************************
//*         Consts           *
//****************************
// Setup requires and https keys & certificates
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
//const db = require("./db/query");

// Just for the readability of the console logs on the server side
const colors = require("colors");

const hsKey = fs.readFileSync(__dirname + "/../ssl/server.key").toString();
const hsCert = fs.readFileSync(__dirname + "/../ssl/server.crt").toString();

// Request handling requires
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });

// Setup server and socket
/** @constant {Object} server https server used to host the project*/
const server = https.createServer({ key: hsKey, cert: hsCert }, app);
/** @constant {number} port port used to host the server on*/
const port = 8888;// 4200 is used by `ng serve`


//****************************
//*      Configuration       *
//****************************
// App params
app.set("trust proxy", 1);
// Router
app.use(express.static(__dirname + "/../dist/FarSpace832c"));
app.use(jsonParser);
app.use(urlencodedParser);


//****************************
//*        Requests          *
//****************************
// GET
app.get("*", (req, res) => {
  console.log(__dirname + "/../dist/FarSpace832c/index.html");
  res.sendFile(__dirname + "/../dist/FarSpace832c/index.html");
});

// POST
app.post("/login/", jsonParser, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    } else {
        //TODO
    }
});
app.post("/register/", jsonParser, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    } else {
        //TODO
    }
});


//****************************
//*       Server Start       *
//****************************
// Make the server use port 4200
server.listen(port, () => {
  console.log("Server is " + "up".bold + " and " + "running".bold + " on https://localhost:" + port + "/");
});


//****************************
//*     Clean up on exit     *
//****************************
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    console.log(
      "\n------------------------------------------------------------------"
    );
    console.log("Stopping the server...");
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid"
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
