console.log(0)
const express = require('express')
const process  = require('process')
const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const path = require('path')
const router = require('./routes/index')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
var morgan = require('morgan')
const bodyParser = require('body-parser')
var hbs = handlebars.create({});
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Category = require('./app/models/category');
const User = require('./app/models/user');
const fileUpload = require('express-fileupload')
const {ObtoOb,ArtoOb} = require('./until/mongooes')
const passport = require('passport')
// app.use(morgan('combined'))
mongoose
.connect('mongodb+srv://websitebanhang:huy12345@websitebanhang.73phjjw.mongodb.net/?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected....'))
.catch((err) => console.log(err))
console.log(1)
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(fileUpload())
app.use(session({secret: 'mk', saveUninitialized: false, resave: false}));
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './src/resources/views');
console.log(2)

require('./until/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res,next) {
  if(req.session.message){
    var message = {
      type: req.session.message.type,
      message: req.session.message.message,
    }
    res.locals.message = message
  }
  req.session.message = null
  next()
})
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
console.log(3)

Category.find({},(err,data)=>{
  if(err){
    return console(err)
  }else{
    app.locals.category = ArtoOb(data)
  }
})
app.get('*', function(req, res,next){
  res.locals.mycart = req.session.cart
  res.locals.user = req.user || null
  hbs.handlebars.registerHelper('name', function(name) {
    return name.name
  })

  hbs.handlebars.registerHelper('checkAdmin', function(user) {
    var user = ObtoOb(user)
    if(user.admin ===1 ) {
      return `<li class="nav-item active"><a class="nav-link" href="/admin/category">Trang quản lí</a> </li>`
    }
  })

  next()
})
console.log(4)

router(app)
console.log(5)

app.listen( process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})