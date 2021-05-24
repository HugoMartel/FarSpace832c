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
const cors = require("cors");
const query = require("./db/query");
const jwt = require('jsonwebtoken');
const io = require('socket.io')(https);

//const expressJwt = require('express-jwt');
const hsKey = fs.readFileSync(__dirname + "/../ssl/server.key").toString();
const hsCert = fs.readFileSync(__dirname + "/../ssl/server.crt").toString();

// Request handling requires
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });
const { body, validationResult } = require("express-validator");

// Setup server and socket
/** @constant {Object} server https server used to host the project*/
const server = https.createServer({ key: hsKey, cert: hsCert }, app);
/** @constant {number} port port used to host the server on*/
const port = process.env.port || 4200; //! 4200 is also used by `ng serve`

//****************************
//*      Configuration       *
//****************************
// App params
app.set("trust proxy", 1);
// Router
app.use(express.static(__dirname + "/../dist/FarSpace832c"));
app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);

//****************************
//*        Requests          *
//****************************

//*******************
//!       GET       !
//*******************
app.get("/", (req, res) => {
    console.log(__dirname + "/../dist/FarSpace832c/index.html");
    res.sendFile(__dirname + "/../dist/FarSpace832c/index.html");

});
app.get("*", (req, res) => {
    res.redirect("/");
});

//*******************
//!     POST        !
//*******************
//? LOGIN
app.post("/login/",
    body("email").trim().isLength({ min: 3 }).escape(),
    body("password").trim().isLength({ min: 8 }).escape(),
    (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            console.error(errors);
            res.json({ error: "Your request couldn't be processed..." });
            return res.status(400).json({ errors: errors.array() });
        } else {
            //console.log(req.body);//! DEBUG

            //Check if the user is already in the database
            query.getUser(req.body.email, req.body.password, (user) => {
                // if the user isn't already in the database
                if (user !== undefined) {
                    let cookieDurationTime=new Date(Date.now() + 3600*2*1000);//+2h
                    // Success message to the frontend
                    let token = jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '2h' });
                    res.cookie("token", token,{expires:cookieDurationTime,secure:true});
                    res.cookie("username", user.username,{expires:cookieDurationTime,secure:true});
                    res.cookie("builds", user.builds,{expires:cookieDurationTime,secure:true});
                    res.json({ message: "You were successfully logged in!" });
                } else {
                    res.json({ fail: "Wrong credentials..." });
                }
            });
        }
    });

//? REGISTER
app.post("/register/",
    body("email").trim().isLength({ min: 3 }).escape(),
    body("password").trim().isLength({ min: 8 }).escape(),
    body("username").trim().isLength({ min: 3 }).escape(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error(errors);
            res.json({ message: "Your request couldn't be processed..." });
            return res.status(400).json({ errors: errors.array() });
        } else {
            // Check if the credentials are correct
            if (
                /[@]/.test(req.body.email) &&
                /\d/.test(req.body.password) &&
                /[A-Z]/.test(req.body.password) &&
                /[a-z]/.test(req.body.password)
            ) {
                //Check if the user is already in the database
                query.hasUser(req.body.email, (hasUser) => {
                    // if the user isn't already in the database
                    if (!hasUser) {
                        // then insert the user !
                        query.insertUser(req.body.email, req.body.username, req.body.password, (response) => {
                            if (response === 1) {
                                //TODO: connect the user and update the display

                                res.json({ message: "Your account was successfully added to the database!" });
                            } else {
                                res.json({ message: "The request to the database was unsuccessful..." });
                            }
                        });
                    } else {
                        res.json({ message: "The email is already registered for an account..." });
                    }
                });
            }
        }

    });
    io.on('connection', (socket) => {
        console.log("hi");
        socket.on("token", (token) => {
            try {
                jwt.verify(token,'RANDOM_TOKEN_SECRET');
            }
            catch(err)
            {
                socket.emit("destroyCookie");
                console.log("token invalide");
            }

        });
    });
      

//****************************
//*       Server Start       *
//****************************
// Make the server use port 4200
server.listen(port, () => {
    console.log("Server is up and running on https://localhost:" + port + "/");
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
        // Final log :)
        console.log("***********************************************************");
        console.log("");
        console.log("                      Jean Barbet                          ");
        console.log("         ,,,          Louis Ducrocq            ,,,         ");
        console.log("        (0 0)         Louis Manouvrier        (* *)        ");
        console.log("  ---ooO-(_)-Ooo---   Hugo Martel       ---ooO-(_)-Ooo---  ");
        console.log("                      Théodore Martin                      ");
        console.log("                      Pierre Mazure                        ");
        console.log("");
        console.log("***********************************************************");
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