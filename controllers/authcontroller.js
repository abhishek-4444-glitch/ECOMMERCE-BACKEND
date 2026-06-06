let users=require('../models/usermodel')
const bcrypt=require('bcrypt')
const mail=require('../utils/gmail')
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
let securitykey=process.env.secretkey
exports.register=async(req,res)=>{
try{
  const {username,password,email,role}=req.body;
  if(!username || !password || !email || !role){
    return res.json({message:"All fields are required"});
  }
  let fetchuser=await users.findOne({username});
  if(fetchuser){
    return res.json({message:"Username already exists"});
  }
  let checkemail=await users.findOne({email});
  if(checkemail){
    return res.json({message:"Email already exists"});
  }

   let hashedpassword=await bcrypt.hash(password,10);

  //store user in database
  await users.create({username,password:hashedpassword,email,role});
  let payload={username:username,role:role};
  let securitykey=process.env.secretkey;
  let token=await jwt.sign(payload,securitykey,{expiresIn:'1hr'});
  console.log("Generated Token:", token);
  
  //send email
  try {
    await gmail.sendTestEmail(email,username);
    res.json({"message":"User registered successfully and confirmation email sent","token":token});
  } catch(emailError) {
    console.error("Email sending failed:", emailError);
    res.json({"message":"User registered successfully but email could not be sent","token":token,"error":emailError.message});
  }
} catch (error) {
  res.json({message:"Error registering user",error:error.message});
}
};
exports.login=async(req,res)=>{
  try{
    const {username,password}=req.body;
    if(!username || !password){
      return res.json({message:"Username and password are required"});
    }
    let userdetails=await users.findOne({username});
    if(!userdetails){
      return res.json({message:"Invalid username or password"});
    }
    let checkpassword=await bcrypt.compare(password,userdetails.password);
    if(!checkpassword){
      return res.json({message:"Invalid username or password"});
    }
    let token=req.headers.authorization;
    let verification=jwt.verify(token, securitykey);
    if(!verification){
      return res.json("invalid credentials");
    }

    let currlocation=req.headers.location
    res.json({msg:"login successfull",currlocation})
  }
  catch(error){
    res.json({message:"Error logging in",error:error.message});
  }
};
