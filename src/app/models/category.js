const mongoose = require('mongoose')
const Schema = mongoose.Schema
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const CategorySchema = new Schema({
    name: {type:String},
    slug: { type: String, slug: "name" ,unique: true},
},{
    collection:'categorys',
    timestamps:true
});
module.exports = mongoose.model('Category',CategorySchema)
