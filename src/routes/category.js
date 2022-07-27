var express = require('express')
const categoryController = require('../app/controllers/categoryController')
var router = express.Router()
router.get('/update/:id',categoryController.showupdate)
router.delete('/:id/delete',categoryController.deletecategory)
router.put('/:id',categoryController.update)
router.get('/add',categoryController.addCategory)
router.post('/add',categoryController.postaddCategory)
router.post('/checkname',categoryController.checkname)
router.get('/',categoryController.show)


module.exports = router