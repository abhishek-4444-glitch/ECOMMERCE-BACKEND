const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const limiter=require('./middleware/ratelimit');
const connectDB=require('./config/db');
let users=require('./models/usermodel');
const cors=require('cors');
const bcrypt=require('bcrypt');
let products=require('./models/product.model');
let gmail=require('./utills/gmail');
const app=express();
const PORT=process.env.port;
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(function(req,res,next){
  console.log("middleware executed");
  next();
});


app.post('/products',async(req,res)=>{
  try{
    const{title,price,image}=req.body;
    await products.create({title,price,image});
    res.json({message:"Product created successfully"});
  } catch (error) {
    res.json({message:"Error creating product",error:error.message});
  };
});

app.get('/products',async(req,res)=>{
  try{
    let allproducts=await products.find();
    res.json({products:allproducts});
  } catch (error) {
    res.json({message:"Error fetching products",error:error.message});
  };
});


app.put('/products/:id',async(req,res)=>{
  try{
    const productId=req.params.id;
   await products.findByIdAndUpdate(productId,req.body)
    res.json({message:"Product updated successfully"});
  } catch (error) {
    res.json({message:"Error updating product",error:error.message});
  }
});

app.delete('/products/:id',async(req,res)=>{
  try{
    const productId=req.params.id;
   await products.findByIdAndDelete(productId)
    res.json({message:"Product deleted successfully"});   
  } catch (error) {
    res.json({message:"Error deleting product",error:error.message});
  }
});



app.post('/register',async(req,res)=>{
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
  
  //send email
  try {
    await gmail.sendTestEmail(email,username);
    res.json({message:"User registered successfully and confirmation email sent"});
  } catch(emailError) {
    console.error("Email sending failed:", emailError);
    res.json({message:"User registered successfully but email could not be sent",error:emailError.message});
  }
} catch (error) {
  res.json({message:"Error registering user",error:error.message});
}
});

app.post('/login',async(req,res)=>{
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
  }
  catch(error){
    res.json({message:"Error logging in",error:error.message});
  }
});





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);     
    connectDB();
})
//paxg enlf dwby omgd