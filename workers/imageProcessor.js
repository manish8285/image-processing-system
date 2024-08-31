const sharp = require('sharp');
const Queue = require('bull');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product.schema');

// Create the queue instance
const queue = new Queue('image-processing', {
 redis: {
  host: 'localhost',
  port: 6379,
 },
});

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
 fs.mkdirSync(uploadDir, { recursive: true });
}

// Define event listeners for job processing
queue.on('completed', async (job, result) => {
 console.log(`Job ${job.id} completed with result: ${result}`);
});

queue.on('failed', async (job, err) => {
 console.error(`Job ${job.id} failed with error: ${err.message}`);
});

// Process jobs
queue.process(async (job) => {
 try {
  const product = await Product.findById(job.data.productId);
  if (!product) throw new Error('Product not found');

  const outputUrls = [];

  for (const [index, url] of product.inputImageUrls.entries()) {
   // Download the image
   const response = await axios.get(url, { responseType: 'arraybuffer' });
   const imageBuffer = Buffer.from(response.data, 'binary');

   // Process the image
   const outputBuffer = await sharp(imageBuffer)
    .jpeg({ quality: 50 })
    .toBuffer();

   // Save the image to the local directory
   const filename = `image_${job.data.productId}_${index}.jpg`;
   const filepath = path.join(uploadDir, filename);
   fs.writeFileSync(filepath, outputBuffer);

   // Push the file path to outputUrls array
   outputUrls.push(filepath);
  }

  // Update the product with the processed image URLs
  product.outputImageUrls = outputUrls;
  product.status = 'Completed';
  product.processedAt = new Date();
  await product.save();
 } catch (error) {
  console.error('Error processing job:', error);
  throw error;
 }
});

// Export the queue
module.exports = queue;
