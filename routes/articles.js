var express = require('express');
var bodyParser = require('body-parser');
var Article = require('../db_models/Article');
var Message = require('../db_models/Message');
var xss = require('xss');
var mongoose = require('mongoose');
var csrf = require('csurf');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: true });
var csrfProtection = csrf({ cookie: true });

function checkLogin(req, res, next) {
    if (req.user)
        next();
    else
        res.redirect('../signin')
}

function checkArticlePoster(req, res, next) {
    if (req.query.id) {
        if (!mongoose.Types.ObjectId.isValid(req.query.id))
            return;
        Article.findById(req.query.id, (err, result) => {
            if (err)
                return next(err);
            if (!result.poster === req.user.username)
                return;
            req.article = result;
            next();
        });
    }
}

function checkMessagePoster(req, res, next) {
    if (req.query.id) {
        if (!mongoose.Types.ObjectId.isValid(req.query.id))
            return;
        Message.findById(req.query.id, (err, result) => {
            if (err)
                return next(err);
            if (!result.poster === req.user.username)
                return;
            req.message = result;
            next();
        });
    }
}

router.get('/', csrfProtection, (req, res, next) => {
    if (req.query.id) {
        if (mongoose.Types.ObjectId.isValid(req.query.id)) {
            Article.findById(req.query.id, (err, article) => {
                if (err)
                    return next(err);
                Message.find({ article_id: req.query.id }, (err2, messages) => {
                    if (err2)
                        return next(err);
                    res.render('articleContent', { article: article, messages: messages, csrfToken: req.csrfToken() });
                });
            });
        }
    }
    else {
        Article.find({}, (err, result) => {
            if (err)
                return next(err);
            res.render('articles', { articles: result });
        });
    }
});

router.get('/post', checkLogin, csrfProtection, (req, res, next) => {
    res.render('post', { csrfToken: req.csrfToken() });
});

router.post('/post', checkLogin, urlencodedParser, csrfProtection, (req, res, next) => {
    if (!req.body.title || !req.body.content || req.body.content.length > 30000)
        return;

    new Article({ poster: req.user.username, title: xss(req.body.title), content: xss(req.body.content) }).save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/articles');
    });
});

router.get('/modify', checkLogin, checkArticlePoster, csrfProtection, (req, res, next) => {
    res.render('article/modify', { article: req.article, csrfToken: req.csrfToken() });
});

router.post('/modify', checkLogin, checkArticlePoster, urlencodedParser, csrfProtection, (req, res, next) => {
    if (!req.body.title || !req.body.content || req.body.content.length > 30000)
        return;
    req.article.title = xss(req.body.title);
    req.article.content = xss(req.body.content);
    req.article.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('../?id=' + req.article._id);
    });
});

router.get('/delete', checkLogin, checkArticlePoster, csrfProtection, (req, res, next) => {
    res.render('confirm', { csrfToken: req.csrfToken(), url: '/articles/delete/?id=' + req.article._id, topic: '刪除文章' });
});

router.post('/delete', checkLogin, checkArticlePoster, urlencodedParser, csrfProtection, (req, res, next) => {
    Article.deleteOne({ _id: req.article._id }, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/articles');
    });
});

router.post('/msg/post', checkLogin, urlencodedParser, csrfProtection, (req, res, next) => {
    if (!req.body.content || req.body.content.length > 300)
        return;
    if (req.query.id) {
        if (mongoose.Types.ObjectId.isValid(req.query.id)) {
            Article.findById(req.query.id, (err, result) => {
                if (err)
                    return next(err);
                new Message({ poster: req.user.username, article_id: req.query.id, content: xss(req.body.content) }).save((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/articles/?id=' + req.query.id);
                });
            });
        }
    }
});

router.get('/msg/delete', checkLogin, checkMessagePoster, csrfProtection, (req, res, next) => {
    res.render('confirm', { csrfToken: req.csrfToken(), url: '/articles/msg/delete/?id=' + req.message._id, topic: '刪除留言' });
});

router.post('/msg/delete', checkLogin, checkMessagePoster, urlencodedParser, csrfProtection, (req, res, next) => {
    Message.deleteOne({ _id: req.message._id }, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/articles/?id=' + req.message.article_id);
    });
});

router.get('/msg/modify', checkLogin, checkMessagePoster, csrfProtection, (req, res, next) => {
    res.render('message/modify', { message: req.message, csrfToken: req.csrfToken() });
});

router.post('/msg/modify', checkLogin, checkMessagePoster, urlencodedParser, csrfProtection, (req, res, next) => {
    if (!req.body.content || req.body.content.length > 300)
        return;
    req.message.content = xss(req.body.content);
    req.message.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/articles/?id=' + req.message.article_id);
    });
});

module.exports = router;
