// initialize the database
const sqlite = require("sqlite3").verbose();
let db = my_database("./phones.db");

// First, create an express application `app`:
const express = require("express");
const cors = require("cors");
const app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

//use cors library to allow request from different ports other than we are using
app.use(cors());

//get all phones
app.get("/api/phones", function (req, res) {
  db.all(`SELECT * FROM phones `, function (err, rows) {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(rows);
  });
});

//get phone by id
app.get("/api/phones/:id", function (req, res) {
  db.get(`SELECT * FROM phones WHERE id=?`, [req.params.id], function (
    err,
    phone
  ) {
    if (err) return res.status(500).json({ error: err.message });
    // if phone doesn't exist return a not found error
    if (!phone)
      return res
        .status(404)
        .json({ error: `Phone with id ${req.params.id} does not exists` });
    return res.status(200).json(phone);
  });
});

//post a phone to the database
app.post("/api/phones", function (req, res) {
  const { brand, model, os, screensize, image } = req.body;
  let missingFields = "";
  //check if any field is missing and if so return a string of the missing elements
  if (!brand) missingFields += "brand, ";
  if (!model) missingFields += "model, ";
  if (!os) missingFields += "os, ";
  if (!screensize) missingFields += "screensize, ";
  if (!image) missingFields += "image, ";

  if (missingFields.length > 0) {
    missingFields = missingFields.slice(0, -2);
    return res
      .status(400)
      .json({ errpr: `There are some fields missing: {${missingFields}}` });
  }
  // check if screensize is not a number
  if (isNaN(+screensize))
    return res.status(400).json({ error: "screensize must be a number!" });

  db.run(
    `INSERT INTO phones (brand, model, os, screensize, image) VALUES (?, ?, ?, ?, ?)`,
    [brand, model, os, screensize, image],

    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ message: "Succesfully added the phone!" });
    }
  );
});

//delete all items from database
app.delete("/api/phones/reset", function (req, res) {
  db.run(`DELETE FROM phones`, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(204).json({ message: "Succesfully deleted the table!" });
  });
});

//delete item by given id
app.delete("/api/phones/:id", function (req, res) {
  db.run(`DELETE FROM phones WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(204).json({ message: "Succesfully deleted the phone!" });
  });
});

//update a phone by id
app.put("/api/phones/:id", function (req, res) {
  const { brand, model, os, screensize, image } = req.body;
  const { id } = req.params;

  let missingFields = "";
  //check if any field is missing and if so return a string of the missing elements
  if (!brand) missingFields += "brand, ";
  if (!model) missingFields += "model, ";
  if (!os) missingFields += "os, ";
  if (!screensize) missingFields += "screensize, ";
  if (!image) missingFields += "image, ";

  if (missingFields.length > 0) {
    missingFields = missingFields.slice(0, -2);
    return res
      .status(400)
      .json({ error: `There are some fields missing: {${missingFields}}` });
  }
  // check if screensize is not a number
  if (isNaN(+screensize))
    return res.status(400).json({ error: "screensize must be a number!" });

  db.run(
    `UPDATE phones SET brand=?, model=?, os=?, screensize=?, image=? WHERE id=?`,
    [brand, model, os, screensize, image, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res
        .status(204)
        .json({ message: "Succesfully updated the phone!" });
    }
  );
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
          screensize INTEGER NOT NULL,
        	image 	CHAR(254) NOT NULL
        	)`);
    db.all(`select count(*) as count from phones`, function (err, result) {
      if (result[0].count == 0) {
        db.run(
          `INSERT INTO phones (brand, model, os, screensize, image) VALUES (?, ?, ?, ?, ?)`,
          [
            "Fairphone",
            "FP3",
            "Android",
            "5.65",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg",
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
