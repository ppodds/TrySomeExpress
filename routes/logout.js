var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var router = express.Router();

urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get('/', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err)
            return next(err);
        res.redirect('..');
    })
});

module.exports = router;
