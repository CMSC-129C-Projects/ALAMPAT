const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commissions'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'

    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    reservationStatus: {
        type: String
    },

    form:{
        type: String,
    },

    totalAmount: {
        type: Number
    }


    
}, { timestamps: true });



const Reservations = mongoose.model("reservations", reservationSchema);
module.exports = Reservations