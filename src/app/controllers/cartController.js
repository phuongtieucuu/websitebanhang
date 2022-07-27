const Category = require('../models/category');
const Producttype = require('../models/producttypes');
const Product = require('../models/product');
const Order = require('../models/order');

var formidable = require('formidable');
const fs = require('fs');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')

class CartController {
    //[get] /cart/add/:id
    addcart(req, res, next) {
        Product.findOne({ _id: req.params.id},(err,data) => {
            if(err){
                return console.log(err);
            }
            if(req.session.cart){
                var cart = req.session.cart
                var check = true
                for( var i = 0; i < cart.length ; i++ ) {
                    if(cart[i].id == data._id){
                        cart[i].qtl++
                        check = false
                        break
                    }
                }
                if(check){
                    cart.push({
                        id: data._id,
                        name: data.name,
                        qtl: 1,
                        price: data.price,
                        img: `/img/${data._id}/${data.img}`,
                        slug: data.slug,
                    })
                }
            }else{
                req.session.cart = []
                req.session.cart.push({
                    id: data._id,
                    name: data.name,
                    qtl: 1,
                    price: data.price,
                    slug: data.slug,
                    img: `/img/${data._id}/${data.img}`,
                })
            }
            res.redirect('back')
    
        })
    }
    //[get] /cart/mycart
    mycart(req, res, next){
        var cart = req.session.cart
        res.render('mycart',{
            cart
        })

    }
    //[get] /cart/update/:slug
    updatecart(req, res, next){
        var slug = req.params.slug
        var cart = req.session.cart
        
        for(var i=0 ; i < cart.length ; i++){
            if(cart[i].slug === slug){
                switch(req.query.action){
                    case "remove": 
                        cart[i].qtl--;
                        if(cart[i].qtl < 1){
                            cart.splice(i,1)
                        }
                        break;
                    case "add": 
                        cart[i].qtl++;
                        break;
                    case "remove": 
                        cart.splice(i,1)
                        if(cart.length <= 0){
                            delete req.session.cart}
                        break;
                    case "clear": 
                        cart.splice(i,1)
                        if(cart.length <= 0){
                            delete req.session.cart}
                        break;
                    case "clearall": 
                        delete req.session.cart
                        break;
                    default : 
                        console.log('Lỗi')
                }
                break;
            }
        }
        res.redirect('back')
    }
    //[get] /cart/delete/
    deletemycart(req, res, next){
        delete req.session.cart
        res.redirect('back')
    }
    //[get] /cart/order/

    ordermycart(req, res, next){
        var user = ObtoOb(req.user)
        var cart = res.locals.mycart    
        if(user){
            var order = new Order({
                userId: user._id,
                cart: cart
            })
            delete req.session.cart
            order.save()
                .then(()=> {
                    req.session.message={
                        type: 'success',
                        message:'Mua thành công'
                    }
                    res.redirect('back')

                })
                .catch(err =>next(err))
        }
    }
}

module.exports = new CartController