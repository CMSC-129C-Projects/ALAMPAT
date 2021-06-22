const Product = require('../models/products')
const Commission = require('../models/commissions')
const User = require('../models/user')

const asyncs =require('async');

function paginatedResults(model){
    return async (req, res, next) =>{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const sort = req.query.sort

        const p_min = parseInt(req.query.p_min)
        const p_max = parseInt(req.query.p_max)

        const search_w = req.query.s_word

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
            page: page + 1,
            limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
            page: page - 1,
            limit: limit    
            }
        }
        try {
            var totalitems = 1
            
            const allquery = function(callback){ 
                model.find({$or: [{ commissionname:{$regex: search_w, $options: 'i'}}, 
                                            { productname:{$regex: search_w, $options: 'i'}}]
                                        })
                .sort(sort)
                .gte('price', p_min)
                .lte('price',p_max)
                .countDocuments(function(err, doc){
                    if(err){ callback(err, null) }
                    else{
                    callback(null, doc);
                    }
                })
            }

            asyncs.parallel([allquery], function(err, result){
                if(err) throw err;
                //totalPages = Math.ceil(result[0]/4)
                totalitems = result[0]
                console.log("Count: " + totalitems)
            })

            allItems = await model.find({$or: [{ commissionname:{$regex: search_w, $options: 'i'}}, 
                                        { productname:{$regex: search_w, $options: 'i'}}]
            })
            .collation({'locale':'en'})
            .sort(sort)
            .gte('price', p_min)
            .lte('price',p_max)
            .limit(limit)
            .skip(startIndex)
            .exec()
            
            //allItems = await model.find({ "name":{$regex: search_w, $options: '-i'}}).sort(sort).gte('price', p_min).lte('price',p_max).limit(limit).skip(startIndex).exec()
            var all = [];
            if(model == Product){
                console.log("I am prods")
                for(var i in allItems){
            
                    const user =  await User.findOne({products: allItems[i]._id } , 'name').exec()
                    if(user){
                    let prod = {
                        _id: allItems[i]._id,
                        itemname: allItems[i].productname, 
                        images: allItems[i].images,
                        description:allItems[i].description,
                        stock:allItems[i].stock,
                        price:allItems[i].price,
                        category:allItems[i].category,
                        sellername: user.name
                    } 
                    all.push(prod)
                    }
        
                }
            } else if(model == Commission){
                console.log("I am Coms")
                for(var i in allItems){
            
                    const user =  await User.findOne({commissions: allItems[i]._id } , 'name').exec()
                    if(user){
                    let prod = {
                        _id: allItems[i]._id,
                        itemname: allItems[i].commissionname, 
                        images: allItems[i].images,
                        description:allItems[i].description,
                        slot:allItems[i].slot,
                        price:allItems[i].price,
                        category:allItems[i].category,
                        sellername: user.name
                    } 
                    all.push(prod)
                    }
                    else if(!user){
                      res.status(404).json({ message: "Seller not found!" })
                    }
        
                }
            }
            
            results.currpage = page
            results.totalitems = totalitems
            results.results = all
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

const getProductList = async (req, res, next) => {
  try{
        //all = res.paginatedResults
        //all = res.paginatedResults.results
        
        return res.status(200).json({
            all:res.paginatedResults.results, 
            totalitems:res.paginatedResults.totalitems,
            currpage: res.paginatedResults.currpage,
        })
  }catch(error){
    console.log(error)
    res.status(404).json({ 
        message: error.message,
        success: false, })
  }
}

const getCommissionList = (req, res, next) => {
    try{
        //all = res.paginatedResults
        return res.status(200).json({
            all:res.paginatedResults.results, 
            totalitems:res.paginatedResults.totalitems,
            currpage: res.paginatedResults.currpage,
        })
  }catch(error){
    console.log(error)
    res.status(404).json({ 
      message: error.message,
        success: false, })
  }
}

const getProduct = (req, res, next) => {
  try{
    Product.findById(req.params._id, async function (err, product){
        if(err) throw err;

        const user = await User.findOne({products: product._id } , 'name profileImage _id').exec()
        if(user){
          let prod = {
            _id: product._id,
            itemname: product.productname, 
            images: [product.images],
            description:product.description,
            stock:product.stock,
            price:product.price,
            category:product.category,
            sellername: user.name,
            seller_id: user._id,
            profileImage: user.profileImage.imageBase64
          } 
          return res.json({ product: prod})
        }
    })
  }catch(error){
    console.log(error)
    res.status(404).json({ 
      message: error.message,
        success: false, })
  }
}


  
const getCommission = (req, res, next) => {
  try{
  Commission.findById(req.params._id, async  function (err, commission){
      if(err) throw err;
      
      const user = await User.findOne({commissions: commission._id } , 'name profileImage _id').exec()
      if(user){
        let com = {
          _id:commission._id ,
          itemname:commission.commissionname , 
          images: [commission.images],
          description:commission.description,
          slot:commission.slot,
          price:commission.price,
          category:commission.category,
          sellername: user.name,
          seller_id: user._id,
          profileImage: user.profileImage.imageBase64
        }
        return res.json({
          commission: com
        })
        
      }
  })
  }catch(error){
    console.log(error)
    res.status(404).json({ 
      message: error.message,
        success: false, })
  }
}

const getAll =  (req, res, next) => {
  try{
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
  }catch(error){
    console.log(error)
    res.status(404).json({ 
        message: error.message,
        success: false, })
  }
}

module.exports = { 
    getProductList, getCommissionList, getAll, getCommission, getProduct, paginatedResults
}