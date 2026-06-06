const mongoose=require('mongoose');
const dotenv=require('dotenv'); 
dotenv.config();
async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.db);
        console.log("Connected to MongoDB");
        return conn;
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}
module.exports=connectDB;