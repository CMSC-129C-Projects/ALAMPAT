const User = require('../models/user')
const Order  = require('../models/order')
const ObjectId = require("mongodb").ObjectID

//for getting orders data for all users
const getOrderList = async(req, res, next) => {
    try{//finds user id and user orders is populated
        const user = await User.findById(req.params.id)
            .populate({
                path:'orders',
                select: '_id reservation totalAmount orderStatus orderType', 
                populate: {
                    path: 'reservation',
                    select: 'service seller buyer',
                    populate: [{
                        path: 'service',
                        select: 'images _id, commissionname price'
                    },{
                        path: 'seller',
                        select: 'name _id',
                    },{
                        path: 'buyer',
                        select: 'name _id',
                    }]
                }
            })
            
        if(user){
        res.status(200).json({
            orderArray: user.orders
        })

        }else{
            res.status(400).json({
                message: "Can't get orders data",
                error: err,
                success: false,
            })
        }
         
    } catch(error){
        console.log(error)
        res.status(404).json({ 
            message : error.message,
            success: false, })
       
    }
}

const getOrderList_Filter = async(req, res, next) => {
    try{//finds user id and user orders is populated
        const user = await User.findById(req.params.id)
            .populate({
                path:'orders',
                select: '_id reservation totalAmount orderStatus orderType',
                match: { orderStatus: req.query.tab},
                populate: {
                    path: 'reservation',
                    select: 'service seller buyer',
                    populate: [{
                        path: 'service',
                        select: 'images _id, commissionname price'
                    },{
                        path: 'seller',
                        select: 'name _id',
                    },{
                        path: 'buyer',
                        select: 'name _id',
                    }]
                }
            })
            
        if(user){
        res.status(200).json({
            orderArray: user.orders
        })

        }else{
            res.status(400).json({
                message: "Can't get orders data",
                error: err,
                success: false,
            })
        }
         
    } catch(error){
        console.log(error)
        res.status(404).json({ 
            message : error.message,
            success: false, })
       
    }
}

const getOrder = async(req, res, next) => {
    try{//finds user id and user orders is populated
        const order = await Order.findById(req.params.order_id)
            .populate({
                
                path: 'reservation',
                select: 'service seller buyer',
                populate: [{
                    path: 'service',
                    select: 'images _id, commissionname price terms'
                },{
                    path: 'seller',
                    select: 'name _id',
                },{
                    path: 'buyer',
                    select: 'name _id phoneNumber email address',
                }]
                
            })
            
        if(order){
        res.status(200).json({
            order: order
        })

        }else{
            res.status(400).json({
                message: "Can't get orders data",
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
//updating function in Orders for Seller only
const updateOrder = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
            let order_updates = {
                orderStatus: req.body.orderStatus, 
                trackingNumber: req.body.trackingNumber,
                progressTrackerDescription: req.body.description,
            }
        //updates the user object data to the database 
            Order.findByIdAndUpdate( req.params.order_id , order_updates)
                .then((result) => {
                    res.json({
                        message: 'Order data updated successfully!',
                        result: result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Order data update failed!',
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
            error,
            success: false, })
    }
}

//adding a new Order from 
const addProductOrder = async(req, res, next) => {
    try{
        let prod_order = new Order ({
            _id: new ObjectId(),
            orderStatus: req.body.orderStatus,
            orderType: req.body.orderType,
            trackingNumber: '',
            items: req.body.checkout_items,
            totalAmount: req.body.totalAmount,
            cancellationReason: req.body.cancellationReason,

            progressTrackerDescription: [''], 
            service: null,
        })

         prod_order.save(function(err, result){
            if(err) throw err;
             if(!err){
                User.findByIdAndUpdate( req.params.id , { $push: { orders: result._id } })
                .then((result) => {
                    
                    res.json({
                        message: "Order added successfully! ",
                        orders: result.orders,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: "Failed to add order to the user!",
                        error: error,
                        success: false,
                    })
                    
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
//adding new commssion order form
const addCommissionOrder = async(req, res, next) => {
    try{
        let comm_order = new Order ({
            _id: new ObjectId(),
            orderStatus: req.query.orderStatus,
            orderType: req.query.orderType,
            trackingNumber: '',
            reservation: req.query.reserv_id,
            
            proof: [req.body.proof],
            
            totalAmount: req.body.totalAmount, 
            amount_paid: req.body.amt_paid,

            progressTrackerDescription: [],
            cancellationReason: '',

            items: [],
        })

         comm_order.save(function(err, result){
            if(err) throw err;
            if(!err){
            User.findByIdAndUpdate( req.params.id , { $push: { orders: result._id } })
            .then(() => {
                User.findByIdAndUpdate( req.query.seller_id , { $push: { orders: result._id } })
                .then(() => {
                    res.json({
                        success: true
                    })
                })
            })
            }
         })
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            message : error.message,
            success: false, })
    
    }

}

module.exports = { 
    getOrderList,addProductOrder, addCommissionOrder, updateOrder, getOrder, getOrderList_Filter
 }