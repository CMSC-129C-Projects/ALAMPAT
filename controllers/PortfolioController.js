const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Portfolio = require('../models/portfolio')

const addArtwork = async(req, res, next) => {
    try{

       /* bcrypt.hash(req.body.artworkimage.filename, 10, function (err, hashedfile){
            if(err){
                res.json({
                    message: "Error in hashing artwork image filename",
                    error: err
                })
            }*/

            let art = new Portfolio ({
                _id: new ObjectId(),
                artworkname: req.body.artworkname, 
                images: {
                    filename: req.body.artworkimage.filename, //hashedfile,
                    contentType: req.body.artworkimage.contentType,
                    imageBase64: req.body.artworkimage.imageBase64
                },
                description:req.body.artworkdescription,
            })
            
            art.save(function(err, result){
                if(!err){
                
                User.findByIdAndUpdate( req.params.id , { $push: { portfolio: result._id } })
                    .then((result) => {
                        //console.log(result)
                        res.json({
                            message: "Artwork Id added to User's Portfolio and saved succesfully! ",
                            success: true,
                        })
                        
                    }).catch((error)=>{
                        res.status(400).json({
                            message: "Artwork Id adding failed to User's Portfolio!",
                            error: error,
                            success: false,
                        })
                        
                    })
    
                }else{
                    res.json({
                        message: 'Artwork Save Failed! Image file name already existed!',
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
            success: false, })
    
    }
    //updates the user object data to the database 
    
}

const getArtworkList = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
            .populate( 'portfolio')
            
        if(user){
        //console.log(results);
        res.status(200).json({
            portfolioArray: user.portfolio
        })

        }else{
            res.status(400).json({
                message: "Can't get portfolio data",
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

const updateArtwork = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
            let art = new Portfolio ({
                artworkname: req.body.artworkname, 
                images: {
                    filename: req.body.artworkimage.filename,
                    contentType: req.body.artworkimage.contentType,
                    imageBase64: req.body.artworkimage.imageBase64
                },
                description:req.body.artworkdescription,
            })
        //updates the user object data to the database 
            Portfolio.findByIdAndUpdate( req.params.artid , art)
                .then((result) => {
                    //console.log(result)
                    res.json({
                        message: 'Artwork data updated successfully!',
                        result,
                        success: true,
                    })
                    
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Artwork data update failed!',
                        error:error,
                        user,
                        success: false,
                    })
                
                })
        
        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: 'Artwork update process failed',
            error,
            success: false, })
    }
}


const deleteArtwork = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
           
        //updates the user object data to the database 
        Portfolio.findByIdAndRemove(req.body._id)
            .then((result)=>{
                User.findByIdAndUpdate( req.params.id , { $pull: { portfolio: result._id } })
                .then((data)=>{
                    res.json({
                        message: 'Artwork data removed successfully!',
                        data: data,
                        success: true,
                    })
                }).catch((error)=>{
                    res.status(400).json({
                        message: 'Artwork data removing failed!',
                        error:error,
                        user,
                        success: false,
                    })
                })
            }).catch((error)=>{
                res.status(400).json({ 
                    message: 'Artwork  data to be removed not found',
                    error: error,
                    success: false, })
            })
        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ 
            message: 'Artwork  data removing process failed',
            error,
            success: false, })
    }
}


const getArtByID = (req, res, next) =>{
    Portfolio.findById(req.params.id)
        .then((art)=>{
            if (!art) {
                console.log()
                return res.status(404).json({
                    message: "Art Data Retrieving Failed",
                    success: false,
                    
                });
            }
            return res.status(200).json({
                message: "Art Data Retrieved successfully",
                success: true,
                artData: art});
        })
        .catch(error => 
            res.status(400).json({
                message: "Data Retrieviing Failed!!",
                error: error,
                success: false
            })
        );
}

module.exports = { 
    addArtwork, getArtworkList, updateArtwork,deleteArtwork, getArtByID
}