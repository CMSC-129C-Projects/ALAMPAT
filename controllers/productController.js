const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Product = require('../models/products')

const addProduct = async(req, res, next) => {
    try{

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
                price:req.body.price
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

        //})
        
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error,
            message: "duh",
            success: false, })
    
    }
    //updates the user object data to the database 
    
}

const getProductList = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .populate( 'products')
            
        if(user){
        //console.log(results);
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
            error,
            success: false, })
    }
}

const updateProduct = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
            let product = new Products ({
                productname: req.body.productname, 
                images: {
                    filename: hashedfile,
                    contentType: req.body.productimage.contentType,
                    imageBase64: req.body.productimage.imageBase64
                },
                description:req.body.productdescription,
            })
        //updates the user object data to the database 
            Products.findByIdAndUpdate( req.params.productid , product)
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
            message: 'Product update process failed',
            error,
            success: false, })
    }
}


const deleteProduct = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
           
        //updates the user object data to the database 
        Product.findByIdAndRemove(req.body._id, function(err, result){
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
            message: 'Product  data removing process failed',
            error,
            success: false, })
    }
}


module.exports = { 
    addProduct, getProductList, updateProduct,deleteProduct
}