const mongoose = require("mongoose");

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter the product name"]
    },
    description:{
        type:String,
        required:[true,"please enter the product description"]
    },
    price:{
        type:Number,
        required:[true,"please enter the product price"],
        maxLength:[8,"price can not exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
        type:String,
        required:true
    },
        url:{
        type:String,
        required:true
    }
}
],
category:{
    type:String,
    required:[true,"please enter the category"]
},
stock:{
    type:Number,
    required:[true,"please enter the product stock"],
    maxLength:[4,"we don't have capacity beyond it"],
    default:1
},
numOfReviews:{
    type:Number,
    default:0
},
reviews:[
    {
        name:{
            type:String,
            required:true

        },
        rating:{
            type:Number,
            required:true

        },
        comments:{
            type:String,
            required:true
        }
    }
],
creatDAT:{
    type:Date,
    default:Date.now

},
user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true

}

        

})


module.exports=mongoose.model("Product",productSchema);

