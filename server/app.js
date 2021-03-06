var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const mongostore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



mongoose.connect("mongodb://localhost:27017/musica", (error, conexion) =>{
  if(error){
    console.log("Error al conectarse con la base de datos Musica " + error.message);
  }else{
    console.log("Conectado a la base de datos de musica");
  }
});

//cookie session
app.use(session({
  secret:"estabienperderconeloponenteperonoconelmiedosrmiyagikaratekid",
  resave: true,
  saveUnitialized:false,
  cookie:{
    maxAge: 1000 * 60 * 10
  },
  store: new mongostore({
    mongooseConnection: mongoose.connection
  })
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
