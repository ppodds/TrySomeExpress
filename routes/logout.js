var express = require('express');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: true });
var csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, (req, res, next) => {
    res.render('confirm', { csrfToken: req.csrfToken(), url: '/logout', topic: '登出' })
});

router.post('/', urlencodedParser, csrfProtection, (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err)
            return next(err);
        res.redirect('..');
    });
});

module.exports = router;
