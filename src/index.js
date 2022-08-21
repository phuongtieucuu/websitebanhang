const express = require('express')
const process  = require('process')
const app = express()
const port =  3000
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
const fileUpload = require('express-fileupload')
const {ObtoOb,ArtoOb} = require('./until/mongooes')
const passport = require('passport')
// app.use(morgan('combined'))
require('./until/hbs')(hbs)
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(fileUpload())
app.use(session({secret: 'mk', saveUninitialized: false, resave: false,cookie: { secure: true }}));
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './src/resources/views');
console.log(2)
mongoose
  .connect('mongodb+srv://websitebanhang:huy12345@websitebanhang.73phjjw.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected....'))
  .catch((err) => console.log(err));
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

router(app)

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})





