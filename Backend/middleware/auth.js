const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const JWT=require("jsonwebtoken");
const User=require("../models/userModel");

//Authentication for Login

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
    const { token }=req.cookies;
    // console.log(token);

    if(!token){
        return next(new ErrorHandler("Please enter your email and password",401));
    }

    const decodedData=JWT.verify(token,process.env.JWT_SECRET);
   req.user= await User.findById(decodedData.id)
    next();
});

// authentication for admin

exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler(`role: ${req.user.role} is not allowed to access this resource`,403)
        )
        };
        next();
    }
}


