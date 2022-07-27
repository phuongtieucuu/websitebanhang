var express = require('express')
const CartController = require('../app/controllers/cartController')
var router = express.Router()


router.get('/add/:id',CartController.addcart)
router.get('/update/:slug',CartController.updatecart)
router.get('/delete',CartController.deletemycart)
router.get('/mycart',CartController.mycart)
router.get('/order',CartController.ordermycart)


module.exports = router