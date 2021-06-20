const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//update the schema for quantity attribute in items array


const orderSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    
    orderStatus: {
        type: String
    },
    
    orderType: {
        type: String,
    },
    
    trackingNumber: {
        type: String,
    },
    
    proof: {
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

    payment_status: {
        type: String
    },
    
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],

    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reservations'
    },

    progressTrackerDescription: [{
        type: String,
    }],

    totalAmount: {
        type: Number,
    },

    cancellationReason:{
        type: String,

    },
},{ timestamps: true });

const Order = mongoose.model("orders", orderSchema);
module.exports = Order