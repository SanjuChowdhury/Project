const mongoose=require("mongoose");


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("connected with mongo server")})
   
   //Catch block is for Unhandled promise rejection with out error handling module
        // .catch((err)=>{
    //     console.log(err)
    // })
}

module.exports=connectDatabase;
