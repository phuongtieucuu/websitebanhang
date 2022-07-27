var express = require('express')
const ProductController = require('../app/controllers/productController')
var router = express.Router()
router.get('/update/:id',ProductController.showupdate)
router.delete('/delete/:id',ProductController.delete)
router.put('/update/:id',ProductController.update)
router.post('/uploadimgs/:id',ProductController.uploadimgs)
router.post('/add',ProductController.postadd)
router.get('/getimg',ProductController.getimg)
router.get('/deleteboxitem',ProductController.deleteboxitem)
router.get('/getproducttype',ProductController.getproducttype)
router.get('/add',ProductController.add)
router.get('/',ProductController.show)


module.exports = router