const User = require('../models/user')
const ObjectId = require("mongodb").ObjectID
const bcrypt = require('bcryptjs')
const Portfolio = require('../models/portfolio')

const addArtwork = async(req, res, next) => {
    try{
        //adds new artwork in the portfolio
            let art = new Portfolio ({
                _id: new ObjectId(),
                artworkname: req.body.artworkname, 
                images: {
                    filename: req.body.artworkimage.filename, 
                    contentType: req.body.artworkimage.contentType,
                    imageBase64: req.body.artworkimage.imageBase64
                },
                description:req.body.artworkdescription,
            })

            
            art.save(function(err, result){
                if(err) throw err;
                if(!err){
                
                User.findByIdAndUpdate( req.params.id , { $push: { portfolio: result._id } })
                    .then((result) => {
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

        
        
    }
    catch(error){
    
        console.log(error)
        res.status(404).json({ 
            message: error.message,
            success: false, })
    
    }

    
}
 //updates the user object data to the database 
const getArtworkList = async(req, res, next) => {
    try{//gets all existing artworks in a user's portfolio
        const user = await User.findById(req.params.id)
            .populate( 'portfolio')
            
        if(user){
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
            message: error.message,
            success: false, })
    }
}

const getArtwork = (req, res, next) => {
    try{//gets a certain artwork
    Portfolio.findById(req.params._id, async  function (err, art){
        if(err) throw err;
        
        return res.json({
            artwork: art
        })
          
    })
  } catch(error){
    console.log(error)
    res.status(404).json({ 
        message: error.message,
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
            message: error.message,
            success: false, })
    }
}


const deleteArtwork = async(req, res, next) => {
    try {
        
            //creates a new user object together with the final image object
           
        //updates the user object data to the database 
        Portfolio.findByIdAndRemove(req.body._id, function(err, result){
            if(err) throw err;
            if(!err){
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
    addArtwork, getArtworkList, updateArtwork,deleteArtwork,getArtwork
}