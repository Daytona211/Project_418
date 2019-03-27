const express = require("express");
const mysql = require("mysql");
const app = express();
//const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// = to app.js
// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(expressLayouts);
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/../views"));


// DATABASE SETUP

const PORT = ('port', process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// // routes
app.use("/",require("./routes/index"));
// app.use("/about", require("./routes/about"));
app.use("/users", require("./routes/users"));

connection.end();