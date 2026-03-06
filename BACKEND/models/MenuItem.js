import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,

  Ingredients: [String]

});

const MenuItem = mongoose.model("MenuItem", menuSchema);

export default MenuItem;