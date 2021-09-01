var express = require('express');
var router = express.Router();
const dbFunctions = require('../modules/persist')

/*
*  Returns list of products in user cart
* */
router.get('/', async function(req, res, next) {
    userId = res.locals.userId
    try{
        let rows = {}
        rows.data = await dbFunctions.getUserCart(userId)
        res.status(200).send(JSON.stringify(rows))
    } catch (e) {
        res.status(500).send(e.message)
    }
});

/* receives product_id and new positive quantity as query and adds the relevant product to the cart.
   Receives user token from cookies and should fetch relevant user
   returns the updated cart.
   inserts event to events table.
 */
router.post('/', async function(req, res, next) {
    let userid =  res.locals.userId
    let username = res.locals.username

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    let product_id = req.query.product_id

    if((typeof(req.query.quantity) =='undefined') || !isPositiveInt(req.query.quantity)){
        return res.status(400).send("invalid quantity")
    }
    let newQuantity = req.query.quantity

    if((typeof(req.query.product_size) =='undefined') || !isPositiveInt(req.query.product_size)){
        return res.status(400).send("invalid product size")
    }
    let product_size = req.query.product_size

    try{
        await dbFunctions.insertIntoUserCart(userid, product_id, newQuantity, product_size)
        let rows = await dbFunctions.getUserCart(userid)
        res.status(200).send(JSON.stringify(rows))
        dbFunctions.logEvent(userid,username,'addToCart',product_id)
    } catch (e) {
        res.status(500).send(e.message)
    }
});


/* receives product_id as query and delete the relevant product from the cart.
   Receives user token from cookies and should fetch relevant user
   inserts event to events table.
   returns the updated cart.
 */
router.delete('/', async function(req, res, next) {
    let userid =  res.locals.userId
    let username = res.locals.username

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    let product_id = req.query.product_id

    if((typeof(req.query.product_size) =='undefined') || !isPositiveInt(req.query.product_size)){
        return res.status(400).send("invalid product size")
    }
    let product_size = req.query.product_size

    try{
        await dbFunctions.deleteFromUserCart(userid, product_id, product_size)
        let rows = await dbFunctions.getUserCart(userid)
        res.status(200).send(JSON.stringify(rows))
        dbFunctions.logEvent(userid,username,'removeFromCart',product_id)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

//creates a new order for order for user and empties cart.
router.post('/checkout', async function(req, res, next) {
    let userid =  res.locals.userId
    let username = res.locals.username

    try{
        let rows = await dbFunctions.getUserCart(userid)
        order = JSON.stringify(rows)
        await dbFunctions.insertIntoUserOrderHistory(userid, order)
        await dbFunctions.emptyUserCart(userid)
        res.status(200).send("checkout successful")
        dbFunctions.logEvent(userid,username,'checkout',null)
    } catch (e) {
        res.status(500).send(e.message)
    }
});


//returns order history of user.
router.get('/history', async function(req, res, next) {
    let userid =  res.locals.userId
    let page = 1

    if(typeof(req.query.page) !=='undefined'){
        page = parseInt(req.query.page)
    }

    try{
        let rows = await dbFunctions.getUserOrderHistory(userid, page)
        res.status(200).send(JSON.stringify(rows))
    } catch (e) {
        res.status(500).send(e.message)
    }
});


router.post('/wishlist', async function(req, res, next) {
    let userid =  res.locals.userId
    let username = res.locals.username

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    let product_id = req.query.product_id

    if((typeof(req.query.product_size) =='undefined') || !isPositiveInt(req.query.product_size)){
        return res.status(400).send("invalid product size")
    }
    let product_size = req.query.product_size

    try{
        await dbFunctions.insertIntoUserWishlist(userid, product_id, product_size)
        let rows = await dbFunctions.getUserWishlist(userid)
        res.status(200).send(JSON.stringify(rows))
        dbFunctions.logEvent(userid,username,'addToWishlist',product_id)
    } catch (e) {
        res.status(500).send(e.message)
    }
});


router.delete('/wishlist', async function(req, res, next) {
    let userid =  res.locals.userId
    let username = res.locals.username

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    let product_id = req.query.product_id

    if((typeof(req.query.product_size) =='undefined') || !isPositiveInt(req.query.product_size)){
        return res.status(400).send("invalid product size")
    }
    let product_size = req.query.product_size

    try{
        await dbFunctions.deleteFromUserWishlist(userid, product_id, product_size)
        let rows = await dbFunctions.getUserWishlist(userid)
        res.status(200).send(JSON.stringify(rows))
        dbFunctions.logEvent(userid,username,'removeFromWishlist',product_id)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.get('/wishlist',  async function(req, res, next) {
    userId = res.locals.userId
    try{
        let rows = await dbFunctions.getUserWishlist(userId)
        res.status(200).send(JSON.stringify(rows))
    } catch (e) {
        res.status(500).send(e.message)
    }
});


function isPositiveInt(str) {
    if(!isNaN(str)){
        let number = parseFloat(str)
        return Number.isInteger(number) && number > 0
    }
    return false
}

module.exports = router;
