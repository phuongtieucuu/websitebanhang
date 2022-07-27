const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoose_delete = require('mongoose-delete')

const OderSchema = new Schema({
    userId: {type:String,ref:'User'},
    cart: {type:Array},
},{
    collection:'orders',
    timestamps:true
});
OderSchema.plugin(mongoose_delete, { overrideMethods: 'all' })
module.exports = mongoose.model('Orders',OderSchema)
