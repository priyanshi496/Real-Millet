import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product' //product id from product model
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "User" //user id from user model
    }
},{
    timestamps : true
})

const CartProductModel = mongoose.model('cartProduct',cartProductSchema)

export default CartProductModel