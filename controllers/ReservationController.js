const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Reserve = require('../models/reservations')

const addReservation = async(req, res, next) => {

    try{
        let rese = new Reserve({
            _id: new ObjectId(),
            service: req.body.service,
            seller: req.body.seller,
            buyer: req.body.buyer,
            reservationStatus: req.body.reservationstatus,
        })        
        
         rese.save(function(err, result){
             if(!err){

            User.findByIdAndUpdate( req.params.id, { $push:{ reservations: result._id}})
                .then((result)=>{
                    res.json({
                        message:"Reservation Id added",
                        success:true
                    })          
                }).catch((error)=>{
                    res.status(400).json({
                        message:"Failed",
                        error: error,
                        success: false
                    })
                })
            }else{
                res.json({
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
            .populate( 'reservations')
            
        if(user){
        //console.log(results);
        res.status(200).json({
            reservationsArray: user.reservations
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
            let rese = new Reserve ({
                _id: new ObjectID(),
                service: req.body.service,
                seller: req.body.seller,
                buyer: req.body.buyer,
                reservationStatus: req.body.reservationstatus,
            })
        //updates the user object data to the database 
            Reserve.findByIdAndUpdate( req.params.reservationid , rese)
                .then((result) => {
                    //console.log(result)
                    res.json({
                        message: 'Reservation data updated successfully!',
                        result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Reservation data update failed!',
                        error:error,
                        user,
                        success: false,
                    })
                
                })
        
        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: 'Reservation update process failed',
            error,
            success: false, })
    }
}

const deleteReservation = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
           
        //updates the user object data to the database 
        Reservation.findByIdAndRemove(req.body._id, function(err, result){
            if(!err){
                User.findByIdAndUpdate( req.params.id , { $pull: { reservations: result._id } })
                .then((data)=>{
                    res.json({
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
        })

        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: 'Reservation  data removing process failed',
            error,
            success: false, })
    }
}


module.exports = { 
    addReservation, getReservationList, updateReservation,deleteReservation
}