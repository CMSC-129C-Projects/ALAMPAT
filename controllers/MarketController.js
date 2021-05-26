const Product = require('../models/products')
const Commission = require('../models/commissions')

const getProductList = (req, res, next) => {
  Product.find({}, function (err, allProducts){
      if(err) throw err;
      return res.json(allProducts)
  })
}

const getCommissionList = (req, res, next) => {
    Commission.find({}, function (err, allCommissions){
        if(err) throw err;
        return res.json(allCommissions)
    })
  }
  


module.exports = { 
    getProductList, getCommissionList
}