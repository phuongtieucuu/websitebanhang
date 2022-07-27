module.exports = {
    check: function (req, res, next) {
    if(req.user && req.user.admin ===1){
        next()
    }else {
        res.redirect('/user/login')
    }
}
}