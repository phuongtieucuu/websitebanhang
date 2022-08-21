const categoryRouter = require('./category')
const producttypeRouter = require('./producttype')
const productRouter = require('./product')
const cartRouter = require('./cart')
const userRouter = require('./user')
const orderRouter = require('./order')
const siteRouter = require('./site')
const  {check }  = require('.././app/middleware/client')


function router(app) {
    app.use('/admin/product',productRouter)
    app.use('/admin/producttype',producttypeRouter)
    app.use('/admin/category',categoryRouter)
    app.use('/admin/order',orderRouter)
    app.use('/cart',cartRouter)
    app.use('/user',userRouter)
    app.use('/',siteRouter)
}

module.exports = router