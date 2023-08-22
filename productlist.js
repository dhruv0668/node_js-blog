import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    company:{
        type:String,
        required:true,
        trim:true
    }
});

const productModel = mongoose.model("product",productSchema);

export default productModel;