var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";

router.get("/users", function (req, res, next) {
  MongoClient.connect(url, function (err, data) {
    if (err) {
      res.send("Error");
    } else {
      var dbo = data.db("mydb");
      dbo
        .collection("users")
        .find({})
        .toArray(function (err, result) {
          if (err) {
            console.log(err);
            res.send("Error again");
          } else {
            res.send(result);
          }
        });
    }
  });
});

router.get("/delete/:username", function (req, res, next) {
  const username = req.params.username;
  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("mydb");
    dbo
      .collection("users")
      .deleteOne({ username: username }, function (err, data) {
        if (err) {
          res.send("Error");
        } else {
          res.send("Successful");
        }
      });
  });
});

router.post("/login", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("mydb");

    dbo
      .collection("users")
      .findOne({ username: username }, function (err, data) {
        if (err) {
          res.send("Error");
        }
        if (!data) {
          res.send("User does not exist");
        } else {
          if (data.password === password) {
            res.send("success");
          } else {
            res.send("Incorrect");
          }
        }
      });
  });
});

router.post("/createuser", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("mydb");
    if (err) {
      res.send("Error accessing database");
    }
    var ob = { username: username, password: password };
    dbo
      .collection("users")
      .findOne({ username: username }, function (err, result) {
        if (err) {
          res.send("Error accessing data");
        }
        if (result) {
          console.log(result);
          res.send("The username is already taken");
        } else {
          dbo.collection("users").insertOne(ob, function (err, data) {
            if (err) {
              res.send("Error adding data");
            }
            res.send("User created");
          });
        }
      });
  });
});

module.exports = router;
