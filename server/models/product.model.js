import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category' //category id from category model
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory' //subCategory id from subCategory model
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        defualt : null
    },
    discount : {
        type : Number,
        default : null  
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

//create a text index
productSchema.index(
    { 
        name: 'text', 
        description: 'text' 
    }, 
    { 
        weights: {
            name: 10,
            description: 5
        } 
    }
);
// Weights are used to assign a level of importance to the fields included in your text index. This allows you to influence how MongoDB ranks the search results.

// For example, if you want the name field to be more important than the description field, you can assign a higher weight to the name field. In this case, we have assigned a weight of 10 to the name field and a weight of 5 to the description field. This means that matches in the name field will be considered more relevant than matches in the description field when performing text searches.

// This index will allow you to perform text searches on the name and description fields of the product documents, and the weights will influence the ranking of the search results based on the relevance of the matches.

const ProductModel = mongoose.model('product',productSchema)

export default ProductModel