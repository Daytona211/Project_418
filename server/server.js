const express = require("express");
const mysql = require("mysql");
const app = express();
//const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
module.exports.app = app;
// = to app.js
// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(expressLayouts);
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "/../views"));

// DATABASE SETUP
var db = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME || 'localhost',
  user     : process.env.RDS_USERNAME || 'root',
  password : process.env.RDS_PASSWORD || '',
  database : process.env.RDS_PORT || 'coding_buddy'
});
module.exports.db = db;  
 
db.connect(()=>{  
    console.log("Connected to DB");
});

const PORT = ('port', process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

//SESSIONS SETUP / TESTING
app.use(session({
  secret: 'sick meme',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: (1000 * 60 * 60), // 1 hr
    sameSite: true,
   }
}));
module.exports.session = session;

// // routes
app.use("/",require("./routes/index"));
// app.use("/about", require("./routes/about"));
app.use("/users", require("./routes/users"));
app.use("/admin", require("./routes/admin"));
// db.end();

//exports Db and Session