import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);