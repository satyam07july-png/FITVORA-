import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        _id: String,
        name: String,
        price: Number,
        image: String,
        qty: Number
      }
    ],

    total: {
      type: Number,
      required: true
    },

    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      house: String,
      street: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    paymentStatus: {
      type: String,
      default: "Unpaid"
    },

    status: {
      type: String,
      default: "Pending"
    },

    estimatedDelivery: {
      type: String,
      default: "45-60 mins"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);