const Category = require('../models/category');
const Product = require('../models/product');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')

class SiteController {
    //[get] /
    home(req, res, next) {
        res.render('home')
        // Product.find({})
        //     .limit(6)
        //     .sort({
        //         createdAt: 'desc'
        //     })
        //     .then(data=>{
        //         res.render('allproducts',{
        //             data: ArtoOb(data)
        //         })
        //     })
        //     .catch(err=> next(err))
    }
    //[get] /products
    products(req, res, next) {
        var page = parseFloat(req.query.page)
        if(!page){ page = 1}
        var sl = 12
        var newProduct =  Product.find({})
            .skip((page -1)*sl)
            .limit(sl)
            .populate('categoryId')
            .populate('producttypeId')
            .sort({
                createdAt: 'desc'
            })

        Promise.all([newProduct,Product.count() ])
            .then(([data,court]) =>res.render('allproducts',{
                data:ArtoOb(data),
                pagesize: page,
                pageindex: court,
                ispage: true,
            }))
            .catch(err =>next(err))
        
    }
    //[get] /products/:slug
    categoryproducts(req,res, next){
        Category.findOne({slug: req.params.slug},(err, category)=>{
            if(err){
                return console.log(err);
            }else {
                Product.find({categoryId: category._id},(err,data)=>{
                    if(err){
                        return console.log(err);
                    }else {
                        res.render('allproducts',{
                            data: ArtoOb(data)
                        })
                    }
                })
                .limit(15)
            }

        })
    }
    //[get] /products/category/:id
    categoryProductsItem(req, res, next) {
        var checkLogin = req.isAuthenticated() ? true : false;
        Product.findOne({ slug: req.params.slug})
            .then(data=>{
                res.render('product',{
                    data: ObtoOb(data),
                    id: data._id,
                    checkLogin
                })
            })
            .catch(err =>next(err))
    }
    
}

module.exports = new SiteController