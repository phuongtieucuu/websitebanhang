module.exports = {
    check: function (req, res, next) {
    if(req.user && req.user.admin ===1){
        next()
    }else {
        res.redirect('/user/login')
    }
    },
    message: function(req, res,next) {
        if(req.session.message){
            var message = {
            type: req.session.message.type,
            message: req.session.message.message,
            }
            res.locals.message = message
        }
        res.locals.mycart = req.session.cart
        res.locals.user = req.user || null
        req.session.message = null
        next()
    }
}