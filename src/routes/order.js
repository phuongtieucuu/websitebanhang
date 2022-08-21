var express = require('express')
const OrderController = require('../app/controllers/orderController')
var router = express.Router()

const  {check }  = require('.././app/middleware/client')

router.post('/delete/:id',OrderController.deleteOrder)
router.post('/action/:id',OrderController.actionOrder)
router.get('/showaction', OrderController.showactionOrder)
router.get('/:id',OrderController.showOrder)
router.get('/',OrderController.show)



module.exports = router