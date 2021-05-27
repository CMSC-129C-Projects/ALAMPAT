const User = require('../models/user')
const Order  = require('../models/order')
const ObjectId = require("mongodb").ObjectID

const addtoCart = async(req, res, next) => {
    try{

        User.findByIdAndUpdate(req.params.id , { $push: { cart: req.body.product_id } })
        .then((result) => {
            res.json({
                message: 'Product added to Cart successfully!',
                result: result.cart,
                success: true,
            })
        }).catch((error) =>{
            res.status(400).json({
                message: 'Failed to add product in Cart',
                error: error,
                success: false,
            })
        })
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error,
            success: false, })
    
    }
}



const getCartItems = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .populate( 'cart')
            
        if(user){
        //console.log(results);
        res.status(200).json({
            cartArray: user.cart
        })

        }else{
            res.status(400).json({
                message: "Can't get cart data",
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

const deleteCartitem = async(req, res, next) => {
    try{

           User.findByIdAndUpdate(req.params.id , { $pull: { cart: {$in: req.body.items_ids} } })
           .then((result) => {
                res.json({
                    message: 'Item/s removed from Cart successfully!',
                    result: result.cart,
                    success: true,
                })
           }).catch((error) =>{
                res.status(400).json({
                    message: 'Failed to remove item/s from Cart',
                    error: error,
                    success: false,
                })
           })
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error,
            success: false, })
    
    }

}


const addReservation = async(req, res, next) => {
    try{

        User.findByIdAndUpdate(req.params.id , { $push: { reservation: req.body.comm_id } })
        .then((result) => {
            res.json({
                message: 'Commission  added to Reservation successfully!',
                result: result.reservation,
                success: true,
            })
        }).catch((error) =>{
            res.status(400).json({
                message: 'Failed to add commission in Reservation',
                error: error,
                success: false,
            })
        })
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error,
            success: false, })
    
    }
}

module.exports = { 
   addtoCart, getCartItems, deleteCartitem, addReservation
}