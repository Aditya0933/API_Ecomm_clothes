const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Helper function to generate a slug
const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
};

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  badge:Boolean,
  category:String,
  bestselling:Boolean,
  images: [String],  // Array of image paths to store uploaded image paths
  slug: { type: String, unique: true }  // Add slug with unique constraint
},
{
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create a model for the Product schema
const Product = mongoose.model('Product', productSchema);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp + file extension as filename
  }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
  }
});

// Create a new product with image upload and slug generation
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
      // Get paths of uploaded images
      // const imagePaths = req.files.map(file => file.path);
      const imagePaths = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      // Generate a unique slug
      const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      
      // Create the new product with the slug
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        badge:req.body.badge,
        category:req.body.category,
        bestselling:req.body.bestselling,
        images: imagePaths,
        slug: slug  // Set the generated slug
      });
      
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product', details: err.message });
    }
  });
// Update a product with image upload
router.patch('/:id', upload.array('images', 10), async (req, res) => {
  try {
    // Get paths of new uploaded images if any
    // const imagePaths = req.files.map(file => file.path);
    const imagePaths = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    const updatedData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      badge:req.body.badge,
      category:req.body.category,
      bestselling:req.body.bestselling,
      images: imagePaths.length ? imagePaths : req.body.images,  // Use new images if uploaded, otherwise keep existing
      slug: generateSlug(req.body.name)  // Optionally update the slug if the name changes
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(updatedProduct);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

module.exports = router;
