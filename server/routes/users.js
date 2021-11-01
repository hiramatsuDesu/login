var express = require('express');
var router = express.Router();
var User = require('../models/usermodel');

/* GET users listing. -- login*/
router.get('/login', function(req, res, next) {
  var userName = (req.session && req.session.username)? req.session.username: "";
  res.render('login', {username: userName});
});

//logout
router.get('/logout', function(req, res, next){
  if(req.session && req.session.username)
  {
    req.session.destroy();
  }
  res.redirect('/users/login');
});

//autenticar
router.post('/login', async function(req, res, next){
  console.log('post login' + req.body.email);
  try{
    let result = await User.authenticate(req.body.logemail, req.body.logpassword);
    if(!result.user){
      res.render('login', {user: {logemail: req.body.logemail}, error: "No se encuentra el usuario"});
    }else{
      req.session.userId = result.user._id;
      req.session.username = result.user.username;
      res.redirect('/albumes');
    }
  }catch(ex){
    res.render('login', {user: {logemail:req.body.logemail}, error: ex.message});
  }
});


//post de register
router.post('/register', function(req,res,next){
  console.log('register' + req.body.email);
  if(req.body.logpassword != req.body.logpasswordconf){
    res.render('login', {user: {email: req.body.email, username: req.body.username}, error: "Las claves no coinciden"});
  }

  //damos de alta el usuario que se registra
  var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }

  User.create(userData, (err, user) =>{
    if(err){
      return res.render('login', {user: {email: req.body.email, username: req.body.username}, error: err.message});
    }else{
      req.session.userId = user._id;
      req.session.username = user.username;
      res.redirect('/albumes');
    }
  });
});

module.exports = router;
