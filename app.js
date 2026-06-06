const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const limiter=require('./middleware/ratelimit');
const connectDB=require('./config/db');
let productroutes=require('./routes/productroutes');
let authroutes=require('./routes/authroutes');
const cors=require('cors');
const app=express();
let securitykey=process.env.secretkey;
const PORT=process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use('/products',productroutes);
app.use('/auth',authroutes);
app.use(function(req,res,next){
  console.log("middleware executed");
  next();
});





connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);     
    })
}).catch((error)=>{
    console.error("Failed to connect to database. Server not started:", error);
    process.exit(1);
})
