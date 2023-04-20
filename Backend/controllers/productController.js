const Product=require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");


// create product=>admin
exports.createProduct=catchAsyncError(async(req,res,next)=>{
    req.body.user=req.user.id
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
}
);


//get all the products
exports.getAllProducts=catchAsyncError( async(req,res)=>{

    // pagination result per page is 5
const resultPerPage=8;
const producstCount=await Product.countDocuments();

const apiFeatures= new  ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
const products=await apiFeatures.query;
    res.status(200).json({
        success:true,
        products,
        producstCount,
        resultPerPage


    });
});

//update products=>Admin
exports.updateProduct=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
     product=await Product.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true,
         useFindAndModify:false

     })
    
    res.status(200).json({
        success:true,
        product
    })
});

//Get product Details
exports.getProductDetails=catchAsyncError( async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found")||404)
    }
    res.status(200).json({
        success:false,
        product
    })


});




//Delete Product

exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){

        return next(new ErrorHandler("product not found "||404))
        // return res.status(500).json({
        //     success:false,
        //     message:("product not found")
        }
   await Product.remove();
    res.status(200).json({
        success:true,
        message:("product removed")
    })
});


