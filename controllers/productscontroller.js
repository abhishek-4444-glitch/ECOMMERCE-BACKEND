let products=require('../models/product.model');
exports.createproduct=async(req,res)=>{
  try{
    const{title,price,image}=req.body;
    await products.create({title,price,image});
    res.json({message:"Product created successfully"});
  } catch (error) {
    res.json({message:"Error creating product",error:error.message});
  };
};

exports.getproduct=async(req,res)=>{
  try{
     let maxlimit=req.query.limit
     let shipment=req.query.location
    let allproducts=await products.find().limit(maxlimit);
    if(shipment !== 'india') {
    return res.json({
        message: `imported from ${shipment}`
    });
}
    res.json({products:allproducts, address: shipment});
  } catch (error) {
    res.json({message:"Error fetching products",error:error.message});
  };
};
exports.updateproduct=async(req,res)=>{
  try{
    const productId=req.params.id;
   await products.findByIdAndUpdate(productId,req.body)
    res.json({message:"Product updated successfully"});
  } catch (error) {
    res.json({message:"Error updating product",error:error.message});
  }
};
exports.deleteproduct=async(req,res)=>{
  try{
   
    const productId=req.params.id;
   await products.findByIdAndDelete(productId)
    res.json({message:"Product deleted successfully"});   
  } catch (error) {
    res.json({message:"Error deleting product",error:error.message});
  }
};

exports.bulkinsert=async (req,res)=>{
  try{

    await products.insertMany(req.body)
      res.json({msg:"products saved"})
  }catch(error){
      res.json(error.message)
    }
  
};