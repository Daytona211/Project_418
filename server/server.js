const express = require("express");
const mysql = require("mysql");
const app = express();
//const expressLayouts = require("express-ejs-layouts");
const path = require("path");


// = to app.js
// Express body parser
app.use(express.urlencoded({ extended: true }));

// app.use(expressLayouts);
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/../views"));
app.use(express.static('public'));

const PORT = ('port', process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// // routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
// app.use("/users", require("./routes/users"));
// app.use("/practice", require("./routes/practice"));
