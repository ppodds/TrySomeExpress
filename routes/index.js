var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

urlencodedParser = bodyParser.urlencoded({ extended: true });

/* GET home page. */
router.get('/', function (req, res, next) {
  const title = ["這是一個糞網站", "Fuck My Life", "其實這裡什麼都沒有啦哈哈", "西哲有云:「如果一件事看起來很複雜，那它肯定不簡單。」"
  , "我不會寫前端", "\\大佬教我/\\大佬教我/\\大佬教我/", "我沒梗了啦哈哈"];
  const random = Math.floor(Math.random() * title.length);
  res.render('index', { title: title[random] });
});

module.exports = router;
