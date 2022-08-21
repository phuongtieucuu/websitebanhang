var express = require('express')
const UserController = require('../app/controllers/userController')
var router = express.Router()


router.get('/register',UserController.register)
router.get('/login',UserController.login)
router.get('/logout',UserController.logout)
router.post('/login',UserController.postlogin)
router.post('/register',UserController.postregister)

module.exports = router