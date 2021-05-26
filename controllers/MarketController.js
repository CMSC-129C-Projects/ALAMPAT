const Product = require('../models/products')
const Commission = require('../models/commissions')
const User = require('../models/user')

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
  
const getAll =  (req, res, next) => {
  Product.find({}, function (err, allProducts){
    if(err) throw err;
    Commission.find({}, async function (err, allCommissions){
      if(err) throw err;
      var all = [];
      for(var i in allProducts){
        if(allProducts[i].stock > 0){
          const user = await User.findOne({products: allProducts[i]._id } , 'name').exec()
          if(user){
            let prod = {
              item: allProducts[i],
              sellername: user.name
            } 
            //console.log("prod: " + JSON.stringify(prod))
            // /allProducts[i]['sellername'] = user.name;
            all.push(prod)
          }
          
        }
        
      }
      for( var i in allCommissions){
        if(allCommissions[i].slot > 0){
          const user = await User.findOne({commissions: allCommissions[i]._id } , 'name').exec()
          if(user){
            let com = {
              item: allCommissions[i],
              sellername: user.name
            }
            //console.log("prod: " + JSON.stringify(prod))
            // /allProducts[i]['sellername'] = user.name;
            all.push(com)
          }
        }
       
      }
      return res.json({
        all : all,
        //allproducts:allProducts,
        //allcommissions:allCommissions
      })
    })
   
  })
}

module.exports = { 
    getProductList, getCommissionList, getAll
}