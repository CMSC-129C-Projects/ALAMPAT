const Product = require('../models/products')
const Commission = require('../models/commissions')
const User = require('../models/user')

const getProductList = (req, res, next) => {
  Product.find({}, async function (err, allProducts){
      if(err) throw err;
      var all = [];

      for(var i in allProducts){
        
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
            all.push(prod)
          }

      }
      return res.json({ all: all})
  })
}

const getProduct = (req, res, next) => {
  Product.findById(req.params._id, async function (err, product){
      if(err) throw err;
      
        
      const user = await User.findOne({products: product._id } , 'name profileImage').exec()
      if(user){
        let prod = {
          _id: product._id,
          itemname: product.productname, 
          images: product.images,
          description:product.description,
          stock:product.stock,
          price:product.price,
          category:product.category,
          sellername: user.name,
          profileImage: user.profileImage.imageBase64
        } 
        return res.json({ product: prod})
      }
      
  })
}

const getCommissionList = (req, res, next) => {
    Commission.find({},async  function (err, allCommissions){
        if(err) throw err;
        var all = [];
        for( var i in allCommissions){
            const user = await User.findOne({commissions: allCommissions[i]._id } , 'name').exec()
            if(user){
              let com = {
                _id:allCommissions[i]._id ,
                itemname:allCommissions[i].commissionname , 
                images: allCommissions[i].images,
                description:allCommissions[i].description,
                slot:allCommissions[i].slot,
                price:allCommissions[i].price,
                category:allCommissions[i].category,
                sellername: user.name
              }

              all.push(com)
            }
        }

        return res.json({
          all: all
        })
    })
  }
  
  const getCommission = (req, res, next) => {
    Commission.findById(req.params._id, async  function (err, commission){
        if(err) throw err;
        
        
        const user = await User.findOne({commissions: commission._id } , 'name profileImage').exec()
        if(user){
          let com = {
            _id:commission._id ,
            itemname:commission.commissionname , 
            images: commission.images,
            description:commission.description,
            slot:commission.slot,
            price:commission.price,
            category:commission.category,
            sellername: user.name,
            profileImage: user.profileImage.imageBase64
          }
          return res.json({
            commission: com
          })
          
        }
        
    })
  }

const getAll =  (req, res, next) => {
  Product.find({}, function (err, allProducts){
    if(err) throw err;
    Commission.find({}, async function (err, allCommissions){
      if(err) throw err;
      var all = [];

      for(var i in allProducts){
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
            all.push(prod)
          }

      }
      for( var i in allCommissions){
          const user = await User.findOne({commissions: allCommissions[i]._id } , 'name').exec()
          if(user){
            let com = {
              _id:allCommissions[i]._id,
              itemname:allCommissions[i].commissionname , 
              images: allCommissions[i].images,
              description:allCommissions[i].description,
              slot:allCommissions[i].slot,
              price:allCommissions[i].price,
              category:allCommissions[i].category,
              sellername: user.name
            }
            all.push(com)
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
    getProductList, getCommissionList, getAll, getCommission, getProduct
}