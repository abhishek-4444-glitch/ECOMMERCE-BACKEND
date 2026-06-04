const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,enum:["seller","buyer"],required:true},
},{timestamps:true});
let usermodel=mongoose.model('User',userSchema);
module.exports=usermodel;
