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
    
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commissions'
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