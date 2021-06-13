const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commissionSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    commissionname: {
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

    description: {
        type: String
    },
 
    category: {
        type: String,
        
    },

    slot: {
        type: Number,
        required: 'Slot can\'t be empty',
    },

    price:{
        type: Number,
        required: 'Price can\'t be empty'
    },

    days:{
        type: Number,
        required: 'Reservation days can\'t be empty'
    },

    terms:{
        type: String,
        required: 'Terms can\'t be empty'
    },

    
}, { timestamps: true });



const Commissions = mongoose.model("commissions", commissionSchema);
module.exports = Commissions