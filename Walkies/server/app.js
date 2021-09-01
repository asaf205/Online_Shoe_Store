var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var productsRouter = require('./routes/products');
var usersRouter = require('./routes/user');
let cartsRouter = require('./routes/carts');
let adminRouter = require('./routes/admin')
let getUserAfterValidation = require('./routes/getUserAfterValidation')
var app = express();
let validateUser = require('./modules/validateUser')

app.use(cors({
  credentials:true,
  origin:"http://localhost:3000",
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);

app.use(validateUser())

app.use('/user', getUserAfterValidation);
app.use('/products', productsRouter);
app.use('/cart', cartsRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send("page not found");
});


module.exports = app;