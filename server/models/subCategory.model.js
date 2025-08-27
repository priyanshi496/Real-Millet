import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "category" //category id from category model
        }
    ]
},{
    timestamps : true
})

const SubCategoryModel = mongoose.model('subCategory',subCategorySchema)

export default SubCategoryModel