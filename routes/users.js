const { query } = require("express");
var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
/* GET users listing. */
var url = "mongodb://localhost:27017/mydb";

router.post("/chat", function (req, res, next) {
  const from = req.body.from;
  const to = req.body.to;

  const query1 = { user1: from, user2: to };
  const query2 = { user1: to, user1: from };
  MongoClient.connect(url, function (err, data) {
    if (err) {
      res.send("error1");
    }
    var dbo = data.db("mydb");
    dbo.collection("chats").findOne(query1 || query2, function (err, result) {
      if (err) {
        res.send("error");
      }
      res.send(result.messages);
    });
  });
});

router.post("/insert", function (req, res, next) {
  const from = req.body.from;
  const to = req.body.to;

  const message = req.body.message;

  const query1 = { user1: from, user2: to };
  const query2 = { user1: to, user1: from };
  MongoClient.connect(url, function (err, data) {
    var dbo = data.db("mydb");
    dbo.collection("chats").findOne(query1 || query2, function (err, result) {
      if (err) {
        res.send("Error");
      }
      if (!result) {
        dbo
          .collection("chats")
          .insertOne(
            { user1: from, user2: to, messages: [[message, from]] },
            function (err, result) {
              if (err) {
                res.send("error3");
              }
              res.send("message sent");
            }
          );
      } else {
        dbo
          .collection("chats")
          .updateOne(
            result,
            { $push: { messages: [message, from] } },
            function (err, data) {
              if (err) {
                res.send("error2");
              }
              res.send("message sent");
            }
          );
      }
    });
  });
});

module.exports = router;
