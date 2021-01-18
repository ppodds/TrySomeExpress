var express = require('express');
var bodyParser = require('body-parser');
var User = require('../db_models/User');
var xss = require('xss');
var passport = require('passport');
var router = express.Router();

urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get('/', (req, res, next) => {
    res.render('signup');
});

router.post('/', urlencodedParser, (req, res, next) => {
    if (!(xss(req.body.username) === req.body.username)) {
        res.end('Username contains something bad!');
        return;
    }
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            if (err.name == 'UserExistsError')
                res.end('A user with the given username is already registered!');
            return next(err);
        }
        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('..');
            });
        });
    });
});

module.exports = router;
