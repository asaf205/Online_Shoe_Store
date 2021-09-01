var express = require('express');
var router = express.Router();
const dbFunctions = require('../modules/persist')


/*
    Receives user token from cookies and should fetch relevant user
    if admin, send events list from events table
    Receives search parameter for user name and relevant page
* */
router.get('/events', async function(req, res, next) {
    let search = "%"
    let page = 1
    if(typeof(req.query.search) !=='undefined'){
        search = '%'+req.query.search+'%'
    }
    if(typeof(req.query.page) !=='undefined'){
        page = parseInt(req.query.page)
    }
    let userid =  res.locals.userId
    if(userid !== 0){
        return res.status(403).send('User not an admin, please change account')
    }

    try{
        let rows = {}
        rows.data = await dbFunctions.searchEvents(search, page)
        rows.count = (await dbFunctions.countEvents(search))[0].count
        res.status(200).send(JSON.stringify(rows))
    } catch (e) {
        res.status(500).send(e.message)
    }
});


router.post('/product', async function(req, res, next) {
    let userid =  res.locals.userId
    if(userid !== 0){
        return res.status(403).send('User not an admin, please change account')
    }

    let productName = ""
    let productPrice = 0
    let productSizes =[]
    let productPicture = ""

    if(typeof(req.query.product_name) !=='undefined'){
        productName = req.query.product_name
    }

    if(typeof(req.query.product_price) !=='undefined'){
        productPrice = req.query.product_price
    }

    if(typeof(req.query.product_picture) !=='undefined'){
        productPicture = req.query.product_picture
    }

    if(typeof(req.query.product_price) !=='undefined'){
        productSizes = req.query.product_sizes
    }

    try{
        await dbFunctions.insertProduct(productName,productPrice,productPicture,productSizes)
        res.status(200).send("new product created")
    } catch (e) {
        res.status(500).send(e.message)
    }
});


router.patch('/product', async function(req, res, next) {
    let userid =  res.locals.userId
    if(userid != 0){
        return res.status(403).send('User not an admin, please change account')
    }

    let productId
    let productName
    let productPrice
    let productSizes
    let productPicture

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    productId = req.query.product_id

    if(typeof(req.query.product_name) !=='undefined'){
        productName = req.query.product_name
    }

    if(typeof(req.query.product_price) !=='undefined'){
        productPrice = req.query.product_price
    }

    if(typeof(req.query.product_picture) !=='undefined'){
        productPicture = req.query.product_picture
    }

    if(typeof(req.query.product_sizes) !=='undefined'){
        productSizes = req.query.product_sizes
    }

    try{
        await dbFunctions.updateProduct(productName, productPrice, productPicture, productSizes, productId)
        res.status(200).send("product updated")
    } catch (e) {
        res.status(500).send(e.message)
    }

});


router.delete('/product', async function(req, res, next) {
    let userid =  res.locals.userId
    if(userid != 0){
        return res.status(403).send('User not an admin, please change account')
    }

    if(typeof(req.query.product_id) ==='undefined'){
        return res.status(400).send("invalid product id")
    }
    let productId = req.query.product_id

    try{
        await dbFunctions.deleteProduct(productId)
        res.status(200).send("product deleted")
    } catch (e) {
        res.status(500).send(e.message)
    }
});


module.exports = router;
