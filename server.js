const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const DB_URI = "mongodb+srv://srinadhchallaa:Srinadh123@cluster1.ckvwp.mongodb.net/carwash_data";
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const carWashSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  carOwnerAddress: { type: String, required: true },
  carNumber: { type: String, required: true, unique: true },
});

const CarWash = mongoose.model('CarWash', carWashSchema);

// CRUD Operations
// 1. Create
app.post('/api/cars', async (req, res) => {
  try {
    const newCar = new CarWash(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. Read All
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await CarWash.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Read by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await CarWash.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Update
app.put('/api/cars/:id', async (req, res) => {
  try {
    const updatedCar = await CarWash.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. Delete
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const deletedCar = await CarWash.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
