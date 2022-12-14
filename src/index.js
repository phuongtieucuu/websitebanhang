const express = require('express')
const app = express()
const port =  3000
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
var morgan = require('morgan')
const bodyParser = require('body-parser')
var hbs = handlebars.create({})
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const Category = require('./app/models/category')
const fileUpload = require('express-fileupload')
const {ObtoOb,ArtoOb} = require('./until/mongooes')
const passport = require('passport')
const {check,message} = require('./app/middleware/client')
mongoose
.connect('mongodb+srv://websitebanhang:huy12345@websitebanhang.73phjjw.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected....'))
.catch((err) => console.log(err))
// app.use(morgan('combined'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(expressValidator())
app.use(cookieParser())
app.use(fileUpload())
app.set('trust proxy', 1)
app.use(session({secret: 'mk', saveUninitialized: true, resave: false,cookie: { secure: true }}))
app.use(passport.initialize())
app.use(passport.session())
app.engine('.hbs', handlebars.engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './src/resources/views')
app.use(message)
require('./until/hbs')(hbs)
require('./until/passport')(passport)

Category.find({},(err,data)=>{
  if(err){
    return console.log(err)
  }else{
    app.locals.category = ArtoOb(data)
  }
})

require('./routes/index')(app)

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})