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
        type: String,
        required: 'Slot can\'t be empty',
    },

    price:{
        type: String,
        required: 'Price can\'t be empty'
    },

    
}, { timestamps: true });



const Commissions = mongoose.model("commissions", commissionSchema);
module.exports = Commissions