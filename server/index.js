//IMPORTS
var express = require("express");
var mysql = require('mysql');


var app = express();
var now = new Date();





app.get('/', function (req, res, next) {
    console.log("request received for /accounts");
    var sqldata = [];
    db.query('SELECT * FROM almatycommunals ORDER BY personalAccount', function (err, rows, fields) {
        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
            console.error(JSON.stringify(err));
            //return here to prevent second res call
            return;
        } else {
            // Loop check on each row
            console.log(rows[0]);

            res.send('accounts');
        }
    });
  });




app.listen(8181);

//Database connection string
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DN123!",
  database: "atm_cbs"
});

//Connection to database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

//-----------------------------------------------------

//FUNCTIONS

//Exectues queries on declared db (it can be extended if you want to use more than one db)
/*function executeQuery(sql, cb) {
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}*/