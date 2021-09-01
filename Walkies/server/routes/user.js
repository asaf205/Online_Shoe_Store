var express = require('express');
var router = express.Router();
const dbFunctions = require('../modules/persist')
const { v4: uuidv4 } = require('uuid');


/* Receives username and password and creates a new user with a new cart table */
router.post('/', async function(req, res, next) {
  let username = ''
  let password = ''
  if( (typeof(req.query.username) !=='undefined') && (typeof(req.query.password) !=='undefined')) {
    username = req.query.username
    password = req.query.password
  } else {
    return res.status(400).send("invalid username and password")
  }

  try{
    let userId = await dbFunctions.insertNewUser(username, password)
    await dbFunctions.createUserCart(userId)
    await dbFunctions.createUserWishlist(userId)
    res.status(200).send("New user id: "+userId)
    dbFunctions.logEvent(userId,username,'register',null)
  } catch (e) {
    res.status(500).send(e.message)
  }
});

router.get('/', async function(req, res, next) {
  let username = ''
  let password = ''
  let rememberMe = 0

  if( (typeof(req.query.username) !=='undefined') && (typeof(req.query.password) !=='undefined')) {
    username = req.query.username
    password = req.query.password
  }
  if(typeof(req.query.rememberMe) !=='undefined'){
    if(req.query.rememberMe === 'true'){
      rememberMe = 1
    }
  }

  try{
    let rows = await dbFunctions.getUser(username,password)
    if(rows.length == 0){
      return res.status(400).send("invalid username and password")
    }
    let token = uuidv4()
    await dbFunctions.insertNewUserSession(rows[0].user_id, username, rememberMe, token)
    if(rememberMe === 0){
      res.cookie('user_token', token, { maxAge: 1800000, httpOnly: true });
    } else {
      res.cookie('user_token', token, { httpOnly: true });
    }
    res.status(200).send("logged in successfully")
    dbFunctions.logEvent(rows[0].user_id,rows[0].username,'login',null)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
module.exports = router;
