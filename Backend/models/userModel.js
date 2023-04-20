//importing npm installed dependecy libraries
const mongoose=require("mongoose");
const validator=require("validator");
const JWT=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const crypto=require("crypto")



// schema design

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
      },
      email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
      },
      avatar: {
        // public_id: {
        //   type: String,
        //   required: true,
        // },
        url: {
          type: String,
          required: true,
          
        },
      },
      role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
      resetPasswordToken: String,
      resetPasswordExpire: Date,
    });
    
// password encryption from admin also
userSchema.pre("save",async function(next){
  
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);

})

// JWT tokens
userSchema.methods.getJWTToken=function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
    

};

// compare password
userSchema.methods.comparePassword=async function(enteredPassword){
     return await bcrypt.compare(enteredPassword,this.password);

}

// reset password
userSchema.methods.getresetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");

    //adding to user schema

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
}



module.exports=mongoose.model("user",userSchema);