var express = require('express');
var router = express.Router();
const dbFunctions = require('../modules/persist')


/* Returns list of products
*  Receives search parameter for product name and relevant page
* */
router.get('/', async function(req, res, next) {
  let search = "%"
  let page = 1
  if(typeof(req.query.search) !=='undefined'){
    search = '%'+req.query.search+'%'
  }
  if(typeof(req.query.page) !=='undefined'){
    page = parseInt(req.query.page)
  }

  try{
    let rows = {}
    rows.data = await dbFunctions.searchProducts(search, page)
    rows.count = (await dbFunctions.countProducts(search))[0].count
    res.status(200).send(JSON.stringify(rows))
  } catch (e) {
    res.status(500).send(e.message)
  }
});


router.get('/single', async function(req, res, next) {
  let id
  if(typeof(req.query.id) !=='undefined'){
    id = req.query.id
  }

  try{
    let rows = await dbFunctions.searchProductById(id)
    res.status(200).send(JSON.stringify(rows))
  } catch (e) {
    res.status(500).send(e.message)
  }
});

module.exports = router;
