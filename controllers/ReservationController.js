const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Reserve = require('../models/reservations')

const addReservation = async(req, res, next) => {

    try{
        //getting the user id of the seller of the commission
        const user = await User.findOne({commissions: req.body.service_id } , '_id').exec()
        let rese = new Reserve({
            _id: new ObjectId(),
            service: req.body.service_id,
            seller: user._id,
            buyer: req.params.id,
            reservationStatus: req.body.reservationstatus,
        })

        

         rese.save(function(err, result){
             if(!err){
            
            //saving the commission in buyer's reservation
            User.findByIdAndUpdate( req.params.id , { $push:{ reservation: result._id}})
                .catch((error)=>{
                    res.status(400).json({
                        message:"Failed",
                        error: error,
                        success: false
                    })
                })

            //saving the commission in seller's reservation
            User.findByIdAndUpdate(user._id, { $push:{ reservation: result._id}})
            .catch((error)=>{
                res.status(400).json({
                    message:"Failed",
                    error: error,
                    success: false
                })
            })

            
            res.status(200).json({
                message:"Reservation Id added",
                result: result,
                success: true
            })          
        

            }else{
                res.status(409).json({
                    message: "Reservation already exists.",
                    succcess: false,
                    err
                })
            }
         })
    }
    catch(error){
        console.log(error)
        res.status(404).json({
            error,
            message: "Error 404",
            success: false
        })
    }
}

const getReservationList = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .populate({ 
                path: 'reservation' , 
                populate: [{
                    path: 'service',
                    select: 'images _id commissionname price days'
                    //model: 'Commissions'
                },{
                    path: 'seller',
                    select: 'name _id'
                },{
                    path: 'buyer',
                    select: 'name _id'
                }]
        })
            
        if(user){
        //console.log(results);
        res.status(200).json({
            reservationsArray: user.reservation
        })

        }else{
            res.status(400).json({
                message: "Can't get reservation data",
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

const getReservation = async(req, res, next) => {
    try{
        const reservation = await Reserve.findById(req.query.id)
            .populate([{
                    path: 'service',
                    select: 'images _id commissionname price days terms'
                    //model: 'Commissions'
                },{
                    path: 'seller',
                    select: 'name _id'
                }]
        )
            
        if(reservation){
        //console.log(results);
        res.status(200).json({
            reserv_data: reservation
        })

        }else{
            res.status(400).json({
                message: "Can't get reservation data",
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

const updateReservation = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
            let rese = {
                reservationStatus: req.query.status,
            }
        //updates the user object data to the database 
            Reserve.findByIdAndUpdate( req.query.res_id , { $set: rese})
                .then((result) => {
                    //console.log(result)
                    res.status(200).json({
                        message: 'Reservation status updated successfully!',
                        result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Reservation status update failed!',
                        error:error,
                        user,
                        success: false,
                    })
                
                })
        
        
    }
    catch (error) {
        console.log(error)
        res.status(404).json({ 
            message: 'Reservation update process failed',
            error,
            success: false, })
    }
}

const deleteReservation = async(req, res, next) => {
    try {
           
        //updates the user object data to the database 
        
        User.findByIdAndUpdate( req.params.id , { $pull: { reservation: req.query.reserv_id } })
        .then((data)=>{
            Reserve.findByIdAndUpdate( req.query.reserv_id , { $set: {reservationStatus: "Invalid"}})
                .then((result) => {
                    //console.log(result)
                    res.status(200).json({
                        message: 'Reservation data updated successfully!',
                        result,
                        success: true,
                    })
                })
            res.status(200).json({
                message: 'Reservation data removed successfully!',
                data: data,
                success: true,
            })
        }).catch((error)=>{
            res.status(400).json({
                message: 'Reservation data removing failed!',
                error:error,
                user,
                success: false,
            })
        })
         

        
    }
    catch (error) {
        console.log(error)
        res.status(404).json({ 
            message: 'Reservation  data removing process failed',
            error,
            success: false, })
    }
}

const removeReservation_inUser = async(req, res, next) => {
    try{

        const buyer  = await User.findByIdAndUpdate(req.params.id , { $pull: { reservation: req.query.reserv_id } })
        const seller = await User.findByIdAndUpdate(req.query.seller_id , { $pull: { reservation: req.query.reserv_id } })
        if(buyer && seller){
            res.status(200).json({
                message: 'Reservation removed in Buyer and Seller successfully!',
                result: buyer,
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
    addReservation, 
    getReservationList, 
    updateReservation,
    deleteReservation,
    getReservation,
    removeReservation_inUser
}