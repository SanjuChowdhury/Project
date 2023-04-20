const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();
const errorMiddleware=require("./middleware/error")
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")

//Route import product
const product=require("./routes/productRoute");

//importing route for user registry
const user=require("./routes/userRoutes")

const payment=require("./routes/paymentRoute")

app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json())

// using ProductModel with this route
app.use("/api/v1",product);

//user route registry
app.use("/api/v1",user);


app.use("/api/v1",payment);


//middleware rgistry
app.use(errorMiddleware);


// exporting module
module.exports=app;
