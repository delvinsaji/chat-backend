var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
/* GET users listing. */
var url = "mongodb://localhost:27017/mydb";

router.post("/chat", function (req, res, next) {
  from = req.body.from;
  to = req.body.to;

  query1 = { user1: from, user2: to };
  query2 = { user1: to, user1: from };
  MongoClient.connect(url, function (err, data) {
    var dbo = data.db("mydb");
    dbo.collection("chats").query(query1 || query2, function (err, result) {
      if (err) {
        res.send("error");
      }
      res.send(result.messages);
    });
  });
});

router.post("/insert", function (req, res, next) {
  from = req.body.from;
  to = req.body.to;

  message = req.body.message;
  query1 = { user1: from, user2: to };
  query2 = { user1: to, user1: from };
  MongoClient.connect(url, function (req, res, next) {
    var dbo = data.db("mydb");
    dbo.collection("chats").query(query1 || query2, function (err, result) {
      if (err) {
        res.send("Error");
      }
      if (!result) {
        dbo
          .collection("chats")
          .create({ user1: from, user2: to, messages: [[messages, from]] });
      } else {
        mess = result.messages;
        mess.push([message, from]);
        dbo.collection("chats").updateOne(result, mess, function (err, data) {
          if (err) {
            res.send("error2");
          }
          res.send("message sent");
        });
      }
    });
  });
});

module.exports = router;
