// Importing other libraries or directories(exported)
const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database")
const cloudinary =require("cloudinary")

//handling Uncaught Errors
process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`),
    console.log("shutting down the server due to uncaught exceptions");
    process.exit(1);

});


//Getting all the information stored in config.env
dotenv.config({path:"Backend/config/config.env"});


//connecting to database
connectDatabase()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})


const server=app.listen(process.env.PORT);


//unhandled promise rejections
process.on("unhandledRejection",err=>{
    console.log(`error: ${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1);
    });
});