const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Category = require('./category')

const ProducttypeSchema = new Schema({
    name: {type:String, required:true},
    categoryId:{type:String ,ref:'Category'}
},{
    collection:'producttypes',
    timestamps:true
});
module.exports = mongoose.model('Producttype',ProducttypeSchema)
