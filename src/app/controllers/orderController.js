const Category = require('../models/category');
const Producttype = require('../models/producttypes');
const Product = require('../models/product');
const Order = require('../models/order');

var formidable = require('formidable');
const fs = require('fs');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')

class OrderController {
    //[get] admin/order/
    show(req, res, next) {
        Order.find({})
            .populate('userId')
            .sort({
                createdAt: 'desc'
            })
            .then(data =>{
        
                res.render('order/view',{data:ArtoOb(data)})
            })
            .catch(err=> next(err))
    }
    //[get] admin/order/:id

    showOrder(req, res, next){
        Order.findOneWithDeleted({_id: req.params.id}).populate('userId')
            .then(data =>{
                res.render('order/vieworder',{data:ObtoOb(data) })
            })
            .catch(err=> next(err)) 
    }
    //[get] admin/order/showaction
    showactionOrder(req, res, next){
        Order.findDeleted({}).populate('userId')
            .then(data =>{
                res.render('order/actionview',{data:ArtoOb(data) })
            })
            .catch(err=> next(err)) 
    }
    //[delete] admin/order/delete/:id
    deleteOrder(req, res, next){
        Order.deleteOne({_id:req.params.id})
            .then(()=>{
                req.session.message = {
                    type: 'danger',
                    message:'Xóa đơn hàng thành công'
                }
                res.redirect('back')
            })
            .catch(err=> next(err)) 
    }
    //[get] admin/order/action/:id
    actionOrder(req, res, next){
        Order.delete({_id:req.params.id})
            .then(()=>{
                req.session.message = {
                    type: 'success',
                    message:'Xử lí đơn hàng thành công'
                }
                res.redirect('back')
            })
            .catch(err=> next(err)) 
    }
    
}

module.exports = new OrderController