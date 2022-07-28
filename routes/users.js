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
  MongoClient(url, function (err, data) {
    var dbo = data.db("mydb");
    dbo.collection("chats").query(query1 || query2, function (err, result) {
      if (err) {
        res.send("error");
      }
      res.send(result.messages);
    });
  });
});

module.exports = router;
