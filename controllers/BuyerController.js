const User = require('../models/user')
const Order  = require('../models/order')
const Product = require('../models/products')
const ObjectId = require("mongodb").ObjectID
const Reserve = require('../models/reservations')

const addtoCart = (req, res, next) => {
    try{
        console.log("received id" + req.params._id)
      
        User.findByIdAndUpdate(req.params.id , { $push: { cart: req.params._id} })
        //if product exists and found on the database
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
        //if user id is found, user cart is populated with items
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
           .then((result) => {//if user id and product id is found, product is deleted
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


const updateReservation = async(req, res, next) => {
    try{

        Reserve.findByIdAndUpdate(req.query.id , { $set: { reservationStatus: req.query.status } })
        .then((result) => {//if query for service id is found, cancel reservation
            res.json({
                message: ' Reservation cancelled successfully!',
                result: result,
                success: true,
            })
        }).catch((error) =>{
            res.status(400).json({
                message: 'Failed to cancel Reservation',
                error: error,
                success: false,
            })
        })
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error: error.message,
            success: false, })
    
    }
}

const getCheckout = async( req, res, next )=>{
    try{

        const reservation = await Reserve.findById(req.query.id)
            .populate([{//if query service id is found, populate the following
                    path: 'service',
                    select: 'images _id commissionname price category'
                },{
                    path: 'seller',
                    select: 'name _id'
                },{
                    path: 'buyer',
                    select: 'name _id email address phoneNumber'
                }]
        )
            
        if(reservation){//get reservation details
        res.status(200).json({
            details: reservation
        })
        }
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            error: error.message,
            success: false, })
    
    }
}

const removeReservation_inBuyer = async(req, res, next) => {
    try{

        const user = await User.findByIdAndUpdate(req.params.id , { $pull: { reservation: req.query.reserv_id } })
        
        if(user){
            res.json({
                message: 'Reservation removed in Buyer successfully!',
                result: user,
                success: true,
            })
        }
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            message: error.message,
            success: false, })
    
    }
}

module.exports = { 
   addtoCart, getCartItems, deleteCartitem, updateReservation, getCheckout, removeReservation_inBuyer
}