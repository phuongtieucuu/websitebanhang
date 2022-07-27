const Category = require('../models/category');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')
class CategoryController {
    // [get] /category
    show(req, res, next) {
        Category.find({})
            .then(data => res.render('category/view',{data:ArtoOb(data)}))
            .catch(err => next(err))
    }
    // [get] /category/add
    addCategory(req, res, next) {
        res.render('category/add')
    }
    // [post] /category/add
    postaddCategory(req, res, next) {
        var name = req.body.name
        if(!name){
            res.render('category/add',{
                message: {
                    type: 'danger',
                    message:'Vui lòng điền tên danh mục'
                } 
            })
        }else{
            Category.findOne(req.body)
                .then(data=>{
                    if(data){
                        res.render('category/add',{
                            message: {
                                type: 'danger',
                                message:'Tên danh mục bị trùng'
                            } 
                        })
                        return
                    }else{
                        Category.create(req.body,(err)=>{
                            Category.find({},function(err, category){
                                if(err) {
                                    return console.log(err)
                                }else{
                                    req.app.locals.category = ArtoOb(category)
                                }
                            
                            })
                            res.render('category/add',{
                                message: {
                                    type: 'success',
                                    message:'Thêm danh mục thành công'
                                }
                            })
                        })
                    }
                })
              
                .catch(err=>console.error(err))
        }
    }
    // [get] /category/:id/update
    showupdate(req, res, next) {
        Category.findOne({_id: req.params.id})
        .then(data=>{
                res.render('category/update',{data : ObtoOb(data)})})
            .catch(err => next(err))
    }

    // [put] /category/:id
    update(req, res, next) {
        req.checkBody('name', 'Hãy điền tên danh mục').notEmpty();
        var errors = req.validationErrors();
        if(errors){
            req.session.errors = errors;
            req.session.success = false;
            res.render('category/update',{ success: req.session.success, errors: req.session.errors,data:{_id: req.params.id} })
            req.session.errors = null
            return
        }else { 
            req.session.success = true;
            Category.findOne(req.body)
                .then(data=>{
                    if(data){
                        data = ObtoOb(data)
                        data._id = req.params.id
                        res.render('category/update',{
                            data,
                            isErr: true,  
                            isSuc: false,
                            message:'Đã có danh mục này'
                        })
                        
                    }else{
                        Category.updateOne({_id: req.params.id},req.body,function(err,data){
                            if(err) {
                                return console.log(err)
                            }else{
                                Category.find({},function(err, category){
                                    if(err) {
                                        return console.log(err)
                                    }else{
                                        req.app.locals.category = ArtoOb(category)
                                    }
                                
                                })
                                req.session.message =  {
                                    type: 'success',
                                    message:'Sửa thành công'
                                }
                                res.redirect('/admin/category')
                            }
                        })
                    }
                })  
        }
    }
    // [delete] /category/:id/delete
    deletecategory(req, res, next){
        Category.deleteOne({_id: req.params.id})
            .then(()=>{
                Category.find({},function(err, category){
                    if(err) {
                        return console.log(err)
                    }else{
                        req.app.locals.category = ArtoOb(category)
                    }
                
                })
                res.redirect('back')})
            .catch(err => next(err))
    }
    checkname(req, res, next){
        Category.findOne({name: req.params.name})
            .then(data=>{
                if(data){
                    res.json({
                        isErr: true,
                        message:'Đã có danh mục này'
                    })
                }else{
                    res.json({
                        isErr: false,
                    })
                }
            })
    }
}

module.exports = new CategoryController