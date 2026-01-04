const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required: true,
    },
    desc:{
        type:String,
        required: true,
    },
    img:{
        type:String,
    },
    cate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    stock:{
        type:Number,
        require:true,
    }
    
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema);