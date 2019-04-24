//IMPORTS
const express = require("express");
const mysql = require('mysql');
const app = express();


const bodyParser = require('body-parser');

const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/cards/:card_number', async (req, res)=> {
  await db.query(`SELECT * FROM cards WHERE number='${req.params.card_number}'`, 
  (err, rows, fields)=> {
    res.status(200).json({card:rows});      
  });
});

app.get('/almaty_communals/:schet', async (req, res)=> {
  await db.query(`SELECT * FROM almaty_communals WHERE personalAccount='${req.params.schet}'`, 
  (err, rows, fields)=> {
    res.status(200).json({schet:rows});      
  });
});

app.get('/astana_communals/:schet', async (req, res)=> {
  await db.query(`SELECT * FROM astana_communals WHERE personalAccount='${req.params.schet}'`, 
  (err, rows, fields)=> {
    res.status(200).json({schet:rows});      
  });
});

app.get('/shymkent_communals/:schet', async (req, res)=> {
  await db.query(`SELECT * FROM shymkent_communals WHERE personalAccount='${req.params.schet}'`, 
  (err, rows, fields)=> {
    res.status(200).json({schet:rows});      
  });
});



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


app.get('/cards', function (req, res, next) {
    console.log("request received for /cards");
    var sqldata = [];
    db.query('SELECT * FROM cards ORDER BY id', function (err, rows, fields) {
        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
            console.error(JSON.stringify(err));
            //return here to prevent second res call
            return;
        } else {
            console.log(rows[0]);
            res.send('cards');
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