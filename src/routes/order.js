var express = require('express')
const OrderController = require('../app/controllers/orderController')
var router = express.Router()

const  {check }  = require('.././app/middleware/client')

router.post('/delete/:id',OrderController.deleteOrder)
router.post('/action/:id',OrderController.actionOrder)
router.get('/showaction',check,OrderController.showactionOrder)
router.get('/:id',check,OrderController.showOrder)
router.get('/',check,OrderController.show)



module.exports = router