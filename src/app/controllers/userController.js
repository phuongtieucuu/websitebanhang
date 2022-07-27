const Category = require('../models/category');
const Producttype = require('../models/producttypes');
const Product = require('../models/product');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const passport = require('passport')

var formidable = require('formidable');
const fs = require('fs');
const {ObtoOb,ArtoOb} = require('../../until/mongooes')
class SiteController {
    //[get] /user/register
    register(req, res, next) {
        res.render('register')
    }
 
    //[post] /user/register

    postregister(req, res, next) {
        var phone = Number.parseFloat(req.body.phone)
        var password = req.body.password;
        console.log(phone.toString().length)
        req.checkBody('name', 'Tên không được để trống').notEmpty();
        req.checkBody('email','Email không xác định').isEmail()
        req.checkBody('username','Tài khoản không được để trống').notEmpty();
        req.checkBody('address','Địa chỉ không được để trống').notEmpty();
        req.checkBody('phone','Số điện thoại không được để trống').notEmpty(phone);
        req.checkBody('password','Mật khẩu không được để trống').isLength({ min: 6 });
        req.checkBody('password2','Password không trùng không được để trống').equals(password);
        var errors = req.validationErrors();
        if(phone.toString().length !== 9){
            errors.push({msg: 'Số điện thoại không chính xác'})
        }
        if(errors){
            req.session.errors = errors;
            res.render('register',{ success: req.session.success, errors: req.session.errors})
            req.session.errors = null
            return
        }else {
            User.findOne({username : req.body.username},(err, user) => {
                if(err) {return console.log(err)}
                if(user) {
                    res.render('register',{
                        isErr:true,
                        isSuc:false,
                        message:'Đã tồn tại tại khoản này'
                    })
                }else {
                    var user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        address: req.body.address,
                        phone: req.body.phone,
                        admin: 0
                    })
                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(user.password,salt,(err,hash)=>{
                            if(err){
                                console.log(123)
                                return console.log(err)
                            }else {
                                user.password =  hash
                                user.save((err)=>{
                                    if(err){
                                        return console.log(err)
                                    }else {
                                        req.session.message =  {
                                            type: 'success',
                                            message:'Tạo tài khoản thành công'
                                        }
                                        res.redirect('/user/login')
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    }
    //[get] /user/login
    login(req, res, next) {
        if(res.locals.user){
            res.redirect('/')
        }else{
            res.render('login')
        }
    }
    //[post] /user/login
    postlogin(req, res, next) {
        passport.authenticate('local', { successRedirect: 'back',failureRedirect: '/user/login' })(req, res, next)
    }
    //[get] /user/logout
    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/user/login');
          });
    }
    
}

module.exports = new SiteController