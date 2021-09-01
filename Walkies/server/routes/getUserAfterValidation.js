var express = require('express');
var router = express.Router();
const dbFunctions = require('../modules/persist')

router.get('/logout', async function(req, res, next) {
    try{
        await dbFunctions.deleteUserSession(res.locals.userId)
        res.clearCookie('user_token');
        res.status(200).send('logout successfully')
        dbFunctions.logEvent(res.locals.userId, res.locals.username,'logout',null)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.get('/id', async function(req, res, next) {
    console.log(res.locals.userId.toString())
    res.status(200).send(res.locals.userId.toString())
})

module.exports = router;