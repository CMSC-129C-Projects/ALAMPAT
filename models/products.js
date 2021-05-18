const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    productname: {
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

    stock: {
        type: String,
        required: 'Stock can\'t be empty',
    },

    price:{
        type: String,
        required: 'Price can\'t be empty'
    },

    
}, { timestamps: true });



const Products = mongoose.model("products", productSchema);
module.exports = Products