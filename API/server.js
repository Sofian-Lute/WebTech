// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/

const sqlite = require("sqlite3").verbose();
let db = my_database("./phones.db");

// First, create an express application `app`:
var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

app.get("/api/phones", function (req, res) {
  db.all(`SELECT * FROM phones `, function (err, rows) {
    if (err) return res.status(500).json({ error: err });

    return res.status(200).json(rows);
  });
});

app.post("/api/phones", function (req, res) {
  db.all(
    `INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
    [
      req.body.brand,
      req.body.model,
      req.body.os,
      req.body.screensize,
      req.body.image,
    ],

    function (err) {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json({ message: "Succesfully added the phone!" });
    }
  );
});

app.put("/api/phones/:id", function (req, res) {
  db.all(
    `UPDATE phones SET brand=?, model=?, os=?, screensize=?, image=? WHERE id=?`,
    [
      req.body.brand,
      req.body.model,
      req.body.os,
      req.body.screensize,
      req.body.image,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err });
      return res
        .status(200)
        .json({ message: "Succesfully updated the phone!" });
    }
  );
});

app.delete("/api/phones/:id", function (req, res) {
  db.all(`DELETE FROM phones WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json({ message: "Succesfully deleted the phone!" });
  });
});

// This should start the server, after the routes have been defined, at port 3000:
app.listen(3000);
console.log(
  "Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello"
);

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
  // Conncect to db by opening filename, create filename if it does not exist:
  var db = new sqlite.Database(filename, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the phones database.");
  });
  // Create our phones table if it does not exist already:
  db.serialize(() => {
    db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
    db.all(`select count(*) as count from phones`, function (err, result) {
      if (result[0].count == 0) {
        db.run(
          `INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
          [
            "Fairphone",
            "FP3",
            "Android",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg",
            "5.65",
          ]
        );
        console.log("Inserted dummy phone entry into empty database");
      } else {
        console.log(
          "Database already contains",
          result[0].count,
          " item(s) at startup."
        );
      }
    });
  });
  return db;
}
