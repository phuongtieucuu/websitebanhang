const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {type:String},
    email: {type:String},
    username: {type:String},
    password: {type:String},
    admin: {type:Number},
    address: {type:String},
    phone: {type:Number},
},{
    collection:'users',
    timestamps:true
});
module.exports = mongoose.model('User',UserSchema)
