var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        poster: { type: String },
        article_id: { type: mongoose.Schema.Types.ObjectId },
        content: { type: String }
    }
);

module.exports = mongoose.model('Message', MessageSchema)