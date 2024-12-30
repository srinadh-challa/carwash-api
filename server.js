const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const DB_URI = "mongodb+srv://srinadhchallaa:Srinadh123@cluster1.ckvwp.mongodb.net/carwash_data";
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Schema and Model
const carWashSchema = new mongoose.Schema({
  ownerName: { type: String, required: true, trim: true },
  carOwnerNumber: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
  carOwnerAddress: { type: String, required: true, trim: true },
  carNumber: { type: String, required: true, unique: true, uppercase: true },
}, {
  timestamps: true,
});

// Pre-save hook to format carOwnerNumber
carWashSchema.pre('save', function (next) {
  this.carOwnerNumber = this.carOwnerNumber.replace(/\D/g, ''); // Remove non-numeric chars
  next();
});

const CarWash = mongoose.model('CarWash', carWashSchema);

// CRUD Routes

// Create a New Car
app.post('/api/cars', async (req, res) => {
  console.log('Request Body:', req.body); // Log request body for debugging
  try {
    const newCar = new CarWash(req.body);
    const savedCar = await newCar.save();
    res.status(201).json({ message: 'Car added successfully!', car: savedCar });
  } catch (error) {
    console.error('Error adding car:', error.message); // Log error details
    res.status(400).json({ message: 'Error adding car', error: error.message });
  }
});


// Get All Cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await CarWash.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
});

// Get a Car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await CarWash.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car', error: error.message });
  }
});

// Get a Car by carOwnerNumber
app.get('/api/cars/number/:carOwnerNumber', async (req, res) => {
  try {
    const car = await CarWash.findOne({ carOwnerNumber: req.params.carOwnerNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found with this owner number' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car', error: error.message });
  }
});

// Update Car Details
app.put('/api/cars/:id', async (req, res) => {
  try {
    const updatedCar = await CarWash.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully!', car: updatedCar });
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

// Delete a Car
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const deletedCar = await CarWash.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
});

// Error Handling for Invalid Routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
