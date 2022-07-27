const Category = require('../models/category');
const Producttype = require('../models/producttypes');
const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('fs');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')
const mkdirp = require('mkdirp');
const { FALSE } = require('node-sass');
class ProductController {
    // [get] /product
    show(req, res, next) {
        var page = parseFloat(req.query.page)
        if(!page){ page = 1}
        var sl = 6
        var newProduct =  Product.find({})
            .skip((page -1)*sl)
            .limit(sl)
            .populate('categoryId')
            .populate('producttypeId')

        Promise.all([newProduct,Product.count() ])
            .then(([data,court]) =>res.render('product/view',{
                data:ArtoOb(data),
                pagesize: page,
                pageindex: court
            }))
            .catch(err =>next(err))
        
    }
    // [get] /product/add
    add(req, res, next) {
        Promise.all([Category.find({}),Producttype.find({})])
            .then(([data1,data2]) =>res.render('product/add',{data1:ArtoOb(data1),data2:ArtoOb(data2)}))
            .catch(err =>next(err))
        
    }
    // [post] /product/add
    postadd(req, res, next) {
        var img = req.files ? req.files.img.name : ''
        req.checkBody('name', 'Hãy điền tên sản phẩm').notEmpty();
        req.checkBody('price', 'Hãy điền giá sản phẩm').notEmpty();
        req.checkBody('categoryId', 'Hãy chọn danh mục sản phẩm').notEmpty();
        var errors = req.validationErrors();
        if(errors){
            req.session.errors = errors;
            Promise.all([Category.find({}),Producttype.find({})])
            .then(([data1,data2]) =>{res.render('product/add',{
                data1:ArtoOb(data1),
                data2:ArtoOb(data2),
                success: req.session.success,
                errors: req.session.errors
            })
            req.session.errors = null}
            )
            .catch(err =>next(err))
            return
        }else {
            Product.findOne({name: req.body.name,categoryId: req.body.categoryId},function(err, data){
                if(data){
                    Promise.all([Category.find({}),Producttype.find({})])
                    .then(([data1,data2]) =>{res.render('product/add',{
                        data1:ArtoOb(data1),
                        data2:ArtoOb(data2),
                        isErr: true,
                        isSuc: false,
                        message:'Danh mục đã có sản phẩm này'
                    })
                    req.session.errors = null}
                    )
                }else {
                    var product = new Product({
                        categoryId: req.body.categoryId,
                        producttypeId: req.body.producttypeId,
                        name: req.body.name,
                        price: req.body.price,
                        desc: req.body.desc,
                        img: img,
                    })
                    product.save(function (err, product) {
                        if (err) {
                            console.log(err)
                            return res.json(err)
                        } else{
                            mkdirp.sync('/Users/Huy/websitebanhang/backend/src/public/img/'+ product._id )
                            mkdirp.sync('/Users/Huy/websitebanhang/backend/src/public/img/'+ product._id +'/' + 'box' )
                            if(img){
                                var newpath = 'C:/Users/Huy/websitebanhang/backend/src/public/img/'+ product._id +'/'+ img
                                req.files.img.mv(newpath,function(err){
                                    if(err){ return res.json(err)}
                                })
                            }
                            Promise.all([Category.find({}),Producttype.find({})])
                            .then(([data1,data2]) =>{res.render('product/add',{
                                data1:ArtoOb(data1),
                                data2:ArtoOb(data2),
                                isErr: false,
                                isSuc: true,
                                message:'Thêm sản phẩm thành công'
                            })
                            req.session.errors = null}
                            )
                            .catch(err =>next(err))
                        }
                    })
                }
            })
        }
    }
    // [get] /product/:id/update
    showupdate(req, res, next) {
        Product.findOne({_id: req.params.id})
            .populate('categoryId')
            .populate('producttypeId')
            .then(data=>res.render('product/update', {
                data:ObtoOb(data), 
                id: data._id
            }))
            .catch(err =>next(err))

    }
    // [put] /product/update/:id
    update(req, res, next) {
        var img = req.files ? req.files.img.name : ''
        if(img){
            req.body.img = img
        }
        req.checkBody('name', 'Hãy điền tên sản phẩm').notEmpty();
        req.checkBody('price', 'Hãy điền giá sản phẩm').notEmpty();
        req.checkBody('categoryId', 'Hãy chọn danh mục sản phẩm').notEmpty();
        var errors = req.validationErrors();
        if(errors){
            req.session.errors = errors;
            res.redirect('/admin/product/update/'+ req.params.id)
        }else {
            Product.findOne({name: req.body.name, _id:{$ne:req.params.id}},function(err, product){
                if(err){return console.log(err)}
                if(product) {
                    Product.findOne({_id: req.params.id},(err,data)=>{
                        if(err){return console.log(err)}
                        return res.render('product/update', {
                            data:ObtoOb(data), 
                            id: data.id,
                            isErr: true,
                            isSuc: false,
                            message:'Đã có tên sản phẩm này'
                        })
                    })
                    .populate('categoryId')
                    .populate('producttypeId')
                }else{
                    Product.findById(req.params.id,(err,p)=>{
                        if(err){return console.log(err)}
                
                        Product.updateOne({_id: req.params.id},req.body, (err,data)=>{
                            if(err){return console.log(err)}
                            if(img){
                                var filePath = `C:/Users/Huy/websitebanhang/backend/src/public/img/${p._id}/${p.img}`; 
                                fs.unlinkSync(filePath)
                                var newpath = 'C:/Users/Huy/websitebanhang/backend/src/public/img/'+ p._id +'/'+ img
                                req.files.img.mv(newpath,function(err){
                                    if(err){ return res.json(err)}
                                })
                            }
                            Product.findOne({_id: req.params.id},(err,pr)=>{
                                if(err){return console.log(err)}
                                return res.render('product/update', {
                                    data:ObtoOb(pr), 
                                    id: data.id,
                                    isErr: false,
                                    isSuc: true,
                                    message:'Sửa thành công'
                                })
                            })
                            .populate('categoryId')
                            .populate('producttypeId')
                        })
                    })
                }
            })
        }
    }


    // [get] /product/getproducttype
    getproducttype(req, res, next) {
        Producttype.find({categoryId: req.query.id})
            .then(data =>res.json({data: ArtoOb(data)}))
            .catch(err => next(err))
        
    }
    // [post] /product/getimg
    getimg(req, res, next) {
        var arr = req.query.id.split('.')
        var namearr = req.query.id.split('\\')
        var nameimg = namearr[namearr.length - 1]
        var png = arr[arr.length - 1]
        if(['png','jpg','jpeg'].includes(png)){
            res.json({
                isErr: false
            })
        }else{
            res.json({
                isErr: true,
                message: 'Vui lòng chọn file png, jpg, jpeg'
            })
        }
        
    }
    
    // [delete] /product/:id/delete
    delete(req, res, next){
        var filePath = `C:/Users/Huy/websitebanhang/backend/src/public/img/${req.params.id}`; 
        fs.rmdir(filePath, { recursive: true },(err)=>{
            if(err){return console.log(err)}
            Product.deleteOne({_id: req.params.id})
                .then(()=>{
                    res.redirect('back')
                })
                .catch(err=> next(err))
        })
    }
    //[post] /admin/product/uploadimgs/:id
    uploadimgs(req, res, next) {
        Product.findById(req.params.id,(err,data)=>{
            if(err){return console.log(err)}
            else{
                var newarr = req.files.images.name
                console.log(newarr)
                if(newarr){
                    var newpath1 = 'C:/Users/Huy/websitebanhang/backend/src/public/img/'+ data._id +'/'+ 'box' +'/'+ newarr
                    req.files.images.mv(newpath1,function(err){
                        if(err){ return res.json(err)}
                    })
                    data.images.push(newarr)
                }else {
                    req.files.images.map(item=>{
                        var newpath = 'C:/Users/Huy/websitebanhang/backend/src/public/img/'+ data._id +'/'+ 'box' +'/'+item.name
                        item.mv(newpath,function(err){
                            if(err){ return res.json(err)}
                        })
                        if(!data.images.includes(item.name)){
                            data.images.push(item.name)
                        }
                    })
                }
                Product.updateOne({_id:data._id }, {images: data.images},()=>{
                    res.redirect('/admin/product/update/'+ data._id)
                })
            }
        })

    }
    //[get]  /admin/product/deleteboxitem
    deleteboxitem(req, res, next){
        Product.findOne({_id: req.query.id},(err,data)=>{
            if(err){ return res.json(err)}
            var filePath = `C:/Users/Huy/websitebanhang/backend/src/public/img/${data._id}/box/${req.query.name}`; 
            fs.unlinkSync(filePath)
            data.images.splice(req.query.index,1)
            Product.updateOne({_id: req.query.id},{images:data.images},(err,product)=>{
                if(err){ return res.json(err)}
                res.redirect('/admin/product/update/'+ data._id)
            })
        })
    }
}

module.exports = new ProductController