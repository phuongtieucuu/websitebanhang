var express = require('express')
const SiteController = require('../app/controllers/siteController')
var router = express.Router()

router.get('/products/category/:slug',SiteController.categoryProductsItem)
router.get('/products/:slug',SiteController.categoryproducts)
router.get('/products',SiteController.products)
router.get('/',SiteController.home)


module.exports = router