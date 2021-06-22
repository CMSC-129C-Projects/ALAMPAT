const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Commission = require('../models/commissions')

const addCommission = async(req, res, next) => {
    try{
        //save commission service for sellers   
            let commission = new Commission ({
                _id: new ObjectId(),
                commissionname: req.body.commissionname, 
                images: {
                    filename: req.body.commissionimage.filename, 
                    contentType: req.body.commissionimage.contentType,
                    imageBase64: req.body.commissionimage.imageBase64
                },
                category: req.body.category,
                description:req.body.commissiondescription,
                slot:req.body.slot,
                price:req.body.price,
                days: req.body.days,
                terms: req.body.terms,
            })
            if (commission.length <= 0){
                return res.send('You must select atleast 1 file.')
            }

            commission.save(function(err, result){//commission service details are saved in the database
                if(err) throw err;
                if(!err){
                
                User.findByIdAndUpdate( req.params.id , { $push: { commissions: result._id } })
                    .then((result) => {
                        res.status(200).json({
                            message: "Commission Id added to User's Commissions and saved succesfully! ",
                            success: true,
                        })
                        
                    }).catch((error)=>{
                        res.status(400).json({
                            message: "Commission Id adding failed to User's commissions!",
                            error: error,
                            success: false,
                        })
                        
                    })
    
                }else{
                    res.json({
                        message: 'Commission Save Failed! Image file name already existed!',
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
    //updates the user object data to the database 
    
}

const getCommissionList = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .populate( 'commissions')
            
        if(user){//if user id is found in the database, populate commissions
        res.status(200).json({
            commissionsArray: user.commissions
        })

        }else{
            res.status(400).json({
                message: "Can't get commission data",
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

const updateCommission = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
            let commission = new Commission ({
                commissionname: req.body.commissionname, 
                images: {
                    filename: req.body.commissionimage.filename,
                    contentType: req.body.commissionimage.contentType,
                    imageBase64: req.body.commissionimage.imageBase64
                },
                description:req.body.commissiondescription,
                slot:req.body.slot,
                price: req.body.price,
                category: req.body.category,
                days: req.body.days,
                terms: req.body.terms,
            })
        //updates the user object data to the database 
            Commission.findByIdAndUpdate( req.params.commissionid , commission)
                .then((result) => {
                    res.status(200).json({
                        message: 'Commission data updated successfully!',
                        result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Commission data update failed!',
                        error:error,
                        user,
                        success: false,
                    })
                
                })
        
        
    }
    catch (error) {
        console.log(error)
        res.status(404).json({ 
            message: error.message,
            success: false, })
    }
}


const deleteCommission = async(req, res, next) => {
    try {
           
        //finds user, then commission service id from the database to be deleted 
        Commission.findByIdAndRemove(req.body._id, function(err, result){
            if(err) throw err;
            if(!err){
                User.findByIdAndUpdate( req.params.id , { $pull: { commissions: result._id } })
                .then((data)=>{
                    res.status(200).json({
                        message: 'Commission data removed successfully!',
                        data: data,
                        success: true,
                    })
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Commission data removing failed!',
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
        res.status(404).json({ 
            message: error.message,
            success: false, })
    }
}


module.exports = { 
    addCommission, getCommissionList, updateCommission,deleteCommission
}