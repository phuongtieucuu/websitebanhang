const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Category = require('./category')
const Producttype = require('./producttypes')
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const ProductSchema = new Schema({
    name: {type:String, required:true},
    categoryId:{type:String ,ref:'Category'},
    producttypeId:{type:String ,ref:'Producttype'},
    img:{type:String },
    desc:{type:String },
    price:{type:Number },
    slug: { type: String, slug: "name" ,unique: true},
    images:{type:Array} 

},{
    collection:'products',
    timestamps:true
});
module.exports = mongoose.model('Product',ProductSchema)
