require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");
ROLE: "admin"

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const menuData = [

  // NON-VEG MEAL BOXES
  { name: "Muscle Gain Chicken Box", price: 259, category: "Non-Veg Meal Box", protein: 45, calories: 550, image: "chicken-box.jpg" },
  { name: "Grilled Chicken Rice Box", price: 249, category: "Non-Veg Meal Box", protein: 40, calories: 520, image: "grilled-chicken.jpg" },

  // VEG MEAL BOXES
  { name: "Power Veg Meal", price: 199, category: "Veg Meal Box", protein: 30, calories: 480, image: "veg-meal.jpg" },
  { name: "Paneer Power Box", price: 229, category: "Veg Meal Box", protein: 35, calories: 500, image: "paneer-box.jpg" },

  // WRAPS
  { name: "Chicken Protein Wrap", price: 179, category: "Non-Veg Wrap", protein: 32, calories: 350, image: "chicken-wrap.jpg" },
  { name: "Paneer Veg Wrap", price: 159, category: "Veg Wrap", protein: 25, calories: 320, image: "paneer-wrap.jpg" },

  // PIZZA
  { name: "Protein Pizza", price: 299, category: "Non-Veg Pizza", protein: 38, calories: 600, image: "protein-pizza.jpg" },
  { name: "Veg Supreme Pizza", price: 249, category: "Veg Pizza", protein: 28, calories: 550, image: "veg-pizza.jpg" },

  // BURGER
  { name: "Chicken Protein Burger", price: 189, category: "Non-Veg Burger", protein: 30, calories: 400, image: "chicken-burger.jpg" },
  { name: "Paneer Veg Burger", price: 169, category: "Veg Burger", protein: 24, calories: 380, image: "veg-burger.jpg" },

  // SALAD
  { name: "Chicken Caesar Salad", price: 199, category: "Non-Veg Salad", protein: 28, calories: 300, image: "chicken-salad.jpg" },
  { name: "Veg Protein Salad", price: 179, category: "Veg Salad", protein: 20, calories: 280, image: "veg-salad.jpg" },

  // PASTA
  { name: "Chicken White Sauce Pasta", price: 229, category: "Non-Veg Pasta", protein: 34, calories: 520, image: "chicken-pasta.jpg" },
  { name: "Veg Red Sauce Pasta", price: 199, category: "Veg Pasta", protein: 22, calories: 480, image: "veg-pasta.jpg" },

  // SHAKES
  { name: "Chocolate Protein Shake", price: 149, category: "Shake", protein: 25, calories: 250, image: "chocolate-shake.jpg" },
  { name: "Banana Peanut Shake", price: 159, category: "Shake", protein: 28, calories: 300, image: "banana-shake.jpg" }

];

const seedDB = async () => {
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuData);
  console.log("Menu Seeded Successfully");
  process.exit();
};

seedDB();
