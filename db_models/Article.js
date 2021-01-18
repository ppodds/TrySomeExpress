var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
    {
        poster: { type: String },
        title: { type: String },
        content: { type: String }
    }
);

module.exports = mongoose.model('Article', ArticleSchema)