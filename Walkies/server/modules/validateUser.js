const dbFunctions = require('./persist')
const { v4: uuidv4 } = require('uuid');

module.exports = function () {
    return async function (req, res, next) {
        if(typeof(req.cookies.user_token) ==='undefined'){
            return res.status(401).send("invalid token please login again")
        }
        try{
            let rows = await dbFunctions.getUserSession(req.cookies.user_token)
            if((rows.length === 0)){
                return res.status(401).send("invalid token please login again")
            }
            let rememberMe = rows[0].remember_me
            let tokenCreationTime = rows[0].creation_time
            if((rememberMe === 0) && (Date.now() - tokenCreationTime > 1800000 )){
                return res.status(401).send("invalid token please login again")
            }
            console.log(res.locals.userId, res.locals.username)
            res.locals.userId = rows[0].user_id
            res.locals.username = rows[0].username
            let token = uuidv4()
            await dbFunctions.insertNewUserSession(rows[0].user_id, rows[0].username, rememberMe, token)
            // res.clearCookie('user_token');
            if(rememberMe == 0){
                res.cookie('user_token', token, { maxAge: 1800000, httpOnly: true });
            } else {
                res.cookie('user_token', token, { httpOnly: true });
            }
            next()
        } catch (e) {
            res.status(500).send(e.message)
        }
    }
}
