const Category = require('../models/category');
const Producttype = require('../models/producttypes');

const {ObtoOb,ArtoOb} = require('../../until/mongooes')

class ProducttypeController {
    // [get] /producttype
    show(req, res, next) {

        Producttype.find({})
            .populate('categoryId')
            .then(data=>res.render('producttype/view',{data:ArtoOb(data)}))
            .catch(err =>next(err))
        
    }
    // [get] /producttype/add
    add(req, res, next) {
        Category.find({})
            .then(data=>res.render('producttype/add',{data:ArtoOb(data)}))
            .catch(err => next(err))

        
    }
    // [post] /producttype/add
    postadd(req, res, next) {
        req.checkBody('name', 'Hãy điền tên loại sản phẩm').notEmpty()
        var errors = req.validationErrors();
        if(errors){
            req.session.errors = errors
            req.session.success = false
            Category.find({})
            .then(data=>res.render('producttype/add',{
                data:ArtoOb(data),
                success: req.session.success,
                errors: req.session.errors
            }))
            .catch(err => next(err))
            return
            
        }
        req.session.success = true
        Producttype.findOne(req.body)
            .then(data =>{
                if(data){
                    Category.find({},(err, data) =>{
                        if(err) return console.log(err)
                        res.render('producttype/add',{
                            data:ArtoOb(data),
                            isErr: true,
                            isSuc: false,
                            message:'Đã có loại sản phẩm này'
                        })
                        return
                    })
             
                    
                }else{
                    return Producttype.create(req.body,(err,data)=>{
                        Category.find({},(err, data) =>{
                            if(err) return console.log(err)
                            res.render('producttype/add',{
                                data:ArtoOb(data),
                                isErr: false,
                                isSuc: true,
                                message:'Thêm loại sản phẩm này thành công'
                            })
                            return
                        })
                    })
                }
            })
            .catch(err => next(err))
    }
    // [get] /producttype/:id/update
    showupdate(req, res, next) {
        Promise.all([Producttype.findOne({_id: req.params.id}).populate('categoryId'),Category.find({})])
            .then(([data1,data2]) =>res.render('producttype/update', {data1:ObtoOb(data1),data2:ArtoOb(data2) }) )
            .catch(err =>next(err))
    }
    // [put] /producttype/:id
    update(req, res, next) {
            req.checkBody('name', 'Hãy điền tên loại sản phẩm').notEmpty();
            var errors = req.validationErrors();
            if(errors){
                req.session.errors = errors;
                Promise.all([Producttype.findOne({_id: req.params.id}).populate('categoryId'),Category.find({})])
                    .then(([data1,data2]) =>
                    {res.render('producttype/update', {
                        data1:ObtoOb(data1),
                        data2:ArtoOb(data2),
                        errors: req.session.errors
                     }) 
                     req.session.errors = null
                    })
                    .catch(err =>next(err))
                return
            }else {
                Producttype.findOne({name: req.body.name}, (err, data) =>{
                    if(err){return console.log(err)}
                    if(data){
                        Promise.all([Producttype.findOne({_id: req.params.id}).populate('categoryId'),Category.find({})])
                            .then(([data1,data2]) =>
                            {res.render('producttype/update', {
                                data1:ObtoOb(data1),
                                data2:ArtoOb(data2),
                                isErr: true,
                                isSuc: false,
                                message:'Đã có loại sản phẩm này'
                            }) 
                            })
                            .catch(err =>next(err))
                    }else {
                        Producttype.updateOne({_id: req.params.id},req.body,(err) =>{
                            if(err){
                                return console.log(err)
                            }else {
                                req.session.message =  {
                                    type: 'success',
                                    message:'Sửa thành công'
                                }
                                res.redirect('/admin/producttype')
                            }
                        })
                    }

                })
            }
    }
    // [delete] /producttype/:id/delete
    delete(req, res, next){
        Producttype.deleteOne({_id: req.params.id})
            .then(()=>res.redirect('back'))
            .catch(err => next(err))
    }
}

module.exports = new ProducttypeController