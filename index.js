//All constants
const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const mongoose= require('mongoose');
const { type } = require('os');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

// Connect to mongoose connection

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Connected to database successfully")).catch((err)=>console.log("Database connection failed: ", err));

// Menu Schema

const menuItem= new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  price: {type: Number, required: true}
})
const Menu= mongoose.model('Menu', menuItem);

// Creating End-Points

// PUT 
app.put('/menu/:id', (req, res)=>{
  const {name, description, price}= req.body;
  const id=req.params.id;
   if(!name && !description && !price){
    return res.status(400).json({message: "Invalid Input"});
   }
   // Updating data

   const updatedData={}
   if (name) updatedData.name = name;
   if (description) updatedData.description= description;
   if (price) updatedData.price= price;

   // Finding and updating and validating 

   Menu.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true})
   .then(updatedItem=>{
    if (!updatedItem){
      return res.status(400).json({message: "Item not found."});
    }
    res.json(updatedItem);
   })
   .catch((err)=>console.log({message: "Failed. Error: ", err}));
})

// Delete 

app.delete('menu/:id/', (req, res)=>{
  const id=req.params.id;

  Menu.findItemByIdAndUpdate(id)
  .then(deletedItem=>{
    if (!deletedItem){
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  })
  .catch((err)=>console.log("Failed to delete. Error: ", err))
});


// Pre-Defined Codes

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
