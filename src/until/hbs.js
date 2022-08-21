module.exports = function(hbs){
    hbs.handlebars.registerHelper('cong1', function(index) {
        return index +1;
    })
    hbs.handlebars.registerHelper('totalcart', function(price,qtl) {
        return price*qtl;
    })
    hbs.handlebars.registerHelper('pages', function(page, arr) {
        var a  = Math.ceil(Number(arr/6))
        var html = []
        html.push(`<li class="page-item"><a class="page-link" href="/admin/product?page=${ page -1 <= 0 ? 1 : page -1}">Previous</a></li>`)
        for(var i = 1; i<=a;i++){
            html.push(`<li class="page-item  ${i === page ? 'active' :''}"><a class="page-link" href="/admin/product?page=${i}">${i}</a></li>`)
        }
        html.push(`<li class="page-item"><a class="page-link" href="/admin/product?page=${ page + 1 >= a ? a : page + 1}">Next</a></li>`)
        return html.join('')
    })
    hbs.handlebars.registerHelper('productpages', function(page, arr) {
        var a  = Math.ceil(Number(arr/12))
        var html = []
        html.push(`<li class="page-item"><a class="page-link" href="/products?page=${ page -1 <= 0 ? 1 : page -1}">Previous</a></li>`)
        for(var i = 1; i<=a;i++){
            html.push(`<li class="page-item  ${i === page ? 'active' :''}"><a class="page-link" href="/products?page=${i}">${i}</a></li>`)
        }
        html.push(`<li class="page-item"><a class="page-link" href="/products?page=${ page + 1 >= a ? a : page + 1}">Next</a></li>`)
        return html.join('')
    })
    hbs.handlebars.registerHelper('total', function(arr) {
        var x = 0
        for(var a of arr) {
            var price = a.price*a.qtl*1
            x += price
        }
        return x
    })

}