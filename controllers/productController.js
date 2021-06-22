const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Product = require('../models/products')

const addProduct = async(req, res, next) => {
    try{//adds new product
            
            let product = new Product ({
                _id: new ObjectId(),
                productname: req.body.productName, 
                images: {
                    filename: req.body.productImage.filename, //hashedfile,
                    contentType: req.body.productImage.contentType,
                    imageBase64: req.body.productImage.imageBase64
                },
                description:req.body.productDescription,
                stock:req.body.stock,
                price:req.body.price,
                category: req.body.category
            })
            if (product.length <= 0){
                return res.send('You must select atleast 1 file.')
            }

            product.save(function(err, result){
                if(!err){
                
                User.findByIdAndUpdate( req.params.id , { $push: { products: result._id } })
                    .then((result) => {
                        //console.log(result)
                        res.json({
                            message: "Product Id added to User's Products and saved succesfully! ",
                            success: true,
                        })
                        
                    }).catch((error)=>{
                        res.status(400).json({
                            message: "Product Id adding failed to User's products!",
                            error: error,
                            success: false,
                        })
                        
                    })
    
                }else{
                    res.json({
                        message: 'Product Save Failed! Image file name already existed!',
                        success: false,
                        err
                    })
                }
            })

        
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            message: error.message,
            success: false, })
    
    }
   
    
}

const getProductList = async(req, res, next) => {
    try{//gets all products of a certain user
        const user = await User.findById(req.params.id)
            .populate('products')
            
        if(user){
        res.status(200).json({
            productsArray: user.products
        })

        }else{
            res.status(400).json({
                message: "Can't get product data",
                error: err,
                success: false,
            })
        }
            
    } catch(error){
        console.log(error)
        res.status(404).json({ 
            message: error.message,
            success: false, })
    }
}

const updateProduct = async(req, res, next) => {
    try { //updates the user object data to the database 
        
            //creates a new user object together with the final image object
            let product =  ({
                productname: req.body.productName, 
                images: {
                    filename: req.body.productImage.filename,
                    contentType: req.body.productImage.contentType,
                    imageBase64: req.body.productImage.imageBase64
                },
                description:req.body.productDescription,
                stock:req.body.stock ,
                price: req.body.price,
                category: req.body.category,
            })
        //updates the user object data to the database 
            Product.findByIdAndUpdate( req.params.productid , { $set: product})
                .then((result) => {
                    //console.log(result)
                    res.json({
                        message: 'Product data updated successfully!',
                        result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Product data update failed!',
                        error:error,
                        user,
                        success: false,
                    })
                
                })
        
        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: error.message,
            success: false, })
    }
}


const deleteProduct = async(req, res, next) => {
    try {
        

        //updates the user object data to the database 
        Product.findByIdAndRemove(req.body._id, function(err, result){
            if(err) throw err;
            if(!err){
                User.findByIdAndUpdate( req.params.id , { $pull: { products: result._id } })
                .then((data)=>{
                    res.json({
                        message: 'Product data removed successfully!',
                        data: data,
                        success: true,
                    })
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Product data removing failed!',
                        error:error,
                        user,
                        success: false,
                    })
                })
            }
        })

        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: error.message,
            success: false, })
    }
}


module.exports = { 
    addProduct, getProductList, updateProduct,deleteProduct
}