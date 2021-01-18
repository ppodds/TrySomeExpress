var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: { type: String, unique: true },
        password: { type: String }
    }
);

UserSchema.methods.verifyPassword = (password)=>{
    if (password === this.password)
        return true;
    else
        return false;
}
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)