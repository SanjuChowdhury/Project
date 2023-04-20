const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncError");

const User=require("../models/userModel");
const sendToken=require("../utils/JWTToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto")
const cloudinary =require("cloudinary")


// Registration

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    });
    const {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,
        avatar:{
            piblic_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });
    // const token=user.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     token
    // });

    sendToken(user,201,res);
});


// login User

exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const{email,password}=req.body;
    // email and password both
    if(!email||!password){
        return next(new ErrorHandler("Please enter the email and password",400))
    }
    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("invalid email or password",401));
    }

    const isPasswordMatched=user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("invalid email or password",401));
    }

    // const token=user.getJWTToken();

    // res.status(200).json({
    //     success:true,
    //     token
    // });

    sendToken(user,200,res)

})

//Logout User

exports.logout=catchAsyncError(async(req,res,next)=>{

    // logic is: once the cookie is expired user will be logged out

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true

    })


    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})


// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });


// forgot password

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }
    //get password token
    const resetToken=user.getresetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message=`your password reset token is:- \n\n${resetPasswordUrl}\n\n
     If you haven't reset your password then please ignore it`;

     try {
         await sendEmail({
             email:user.email,
             subject:"ecom password recovery",
             message

         })
         res.status(200).json({
             success:true,
             message:`email sent to ${user.email} successfully`
         })
         
     } catch (error) {
         user.getresetPasswordToken=undefined;
         user.getresetPasswordExpire=undefined;

         await user.save({validateBeforeSave:false});

         return next(new ErrorHandler(error.message,500))
         
     }


})


// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
  