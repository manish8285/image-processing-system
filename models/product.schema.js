const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
 requestId: { type: String, required: true },
 serialNumber: { type: Number, required: true },
 productName: { type: String, required: true },
 inputImageUrls: { type: [String], required: true },
 outputImageUrls: { type: [String] },
 status: {
  type: String,
  enum: ['Pending', 'Processing', 'Completed'],
  default: 'Pending',
 },
 processedAt: { type: Date },
});

module.exports = mongoose.model('Product', ProductSchema);
