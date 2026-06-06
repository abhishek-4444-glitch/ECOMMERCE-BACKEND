const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    description: { type: String },
    category:{ type: String },
    rating: {
    rate:  { type: Number },
    count: { type: Number },
  }
}, { timestamps: true });
let products=mongoose.model('Product', productSchema);
module.exports=products;