const Product = require('../models/products')
const Commission = require('../models/commissions')
const User = require('../models/user')

const getProductList = (req, res, next) => {
  Product.find({}, async function (err, allProducts){
      if(err) throw err;
      var all = [];

      for(var i in allProducts){
        //if(allProducts[i].stock > 0){
          const user = await User.findOne({products: allProducts[i]._id } , 'name').exec()
          if(user){
            let prod = {
              _id: allProducts[i]._id,
              itemname: allProducts[i].productname, 
              images: allProducts[i].images,
              description:allProducts[i].description,
              stock:allProducts[i].stock,
              price:allProducts[i].price,
              category:allProducts[i].category,
              sellername: user.name
            } 
            //console.log("prod: " + JSON.stringify(prod))
            // /allProducts[i]['sellername'] = user.name;
            all.push(prod)
          }
          
        //}
        
      }
      return res.json({ all: all})
  })
}

const getCommissionList = (req, res, next) => {
    Commission.find({},async  function (err, allCommissions){
        if(err) throw err;
        var all = [];
        for( var i in allCommissions){
          //if(allCommissions[i].slot > 0){
            const user = await User.findOne({commissions: allCommissions[i]._id } , 'name').exec()
            if(user){
              let com = {
                _id:allCommissions[i] ,
                itemname:allCommissions[i].commissionname , 
                images: allCommissions[i].images,
                description:allCommissions[i].description,
                stock:allCommissions[i].stock,
                price:allCommissions[i].price,
                category:allCommissions[i].category,
                sellername: user.name
              }
              //console.log("prod: " + JSON.stringify(prod))
              // /allProducts[i]['sellername'] = user.name;
              all.push(com)
            }
          //}
         
        }

        return res.json({
          all: all
        })
    })
  }
  
const getAll =  (req, res, next) => {
  Product.find({}, function (err, allProducts){
    if(err) throw err;
    Commission.find({}, async function (err, allCommissions){
      if(err) throw err;
      var all = [];

      for(var i in allProducts){
        //if(allProducts[i].stock > 0){
          const user = await User.findOne({products: allProducts[i]._id } , 'name').exec()
          if(user){
            let prod = {
              _id: allProducts[i]._id,
              itemname: allProducts[i].productname, 
              images: allProducts[i].images,
              description:allProducts[i].description,
              stock:allProducts[i].stock,
              price:allProducts[i].price,
              category:allProducts[i].category,
              sellername: user.name
            } 
            //console.log("prod: " + JSON.stringify(prod))
            // /allProducts[i]['sellername'] = user.name;
            all.push(prod)
          }
          
        //}
        
      }
      for( var i in allCommissions){
        //if(allCommissions[i].slot > 0){
          const user = await User.findOne({commissions: allCommissions[i]._id } , 'name').exec()
          if(user){
            let com = {
              _id:allCommissions[i] ,
              itemname:allCommissions[i].commissionname , 
              images: allCommissions[i].images,
              description:allCommissions[i].description,
              stock:allCommissions[i].stock,
              price:allCommissions[i].price,
              category:allCommissions[i].category,
              sellername: user.name
            }
            //console.log("prod: " + JSON.stringify(prod))
            // /allProducts[i]['sellername'] = user.name;
            all.push(com)
          }
        //}
       
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