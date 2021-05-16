const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    artworkname: {
        type: String,
        required: 'Name can\'t be empty'
    },

    images: {
       
        filename : {
            type : String,
        
            sparse:true
            
        },
        contentType : {
            type: String,
           
        },
        imageBase64 : {
            type : String,
        }
    
    },
 
    category: {
        type: String,
        
    },

    description: {
        type: String
    },

    
}, { timestamps: true });



const Portfolio = mongoose.model("portfolios", portfolioSchema);
module.exports = Portfolio