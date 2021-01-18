const passport = require('passport');
const User = require('../db_models/User');

const LocalStrategy = require('passport-local').Strategy;

strategy = new LocalStrategy((username, password, done) => {
    user = User.findOne({ username: username }, (err, user) => {
        if (err)
            return done(err);
        else if (!user)
            return done(null, false);
        else if (!user.verify)
            return done(null, false);
        else if (!user.verifyPassword(password))
            return done(null, false, { message: 'Incorrect password!' })
        else
            return done(null, user);
    });
}
)

module.exports = strategy;